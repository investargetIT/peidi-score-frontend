import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getDeptTree } from "@/api/pmApi";
import { getTeamBuildingExpenses } from "@/api/user";

/** 团建经费标准：每人每月 60 元（与手工台账一致） */
const MONTHLY_FUND = 60;
const FONT_NAME = "宋体";

/** 员工信息（只需用到 userId / hireDate / deptId，兼容员工列表原始记录） */
export interface FundExportEmployee {
  userId?: string | number | null;
  hireDate?: string;
  /** 员工档案部门 id（/user/page 返回，与列表树同源，通常比经费接口的钉钉部门 id 新） */
  deptId?: string | number | null;
}

export interface FundLedgerExportOptions {
  /** 导出年度，默认当前年 */
  year?: number;
  /** 员工列表：用于按 userId 补入职日期、补部门（经费接口部门失效时） */
  employees?: FundExportEmployee[];
}

export interface FundLedgerExportResult {
  /** 员工人数（去重） */
  people: number;
  /** 台账行数（= 人数） */
  rows: number;
  /** 部门块（合并块）数 */
  groups: number;
  /** 申请金额合计 */
  totalAmount: number;
}

/**
 * 台账一行：一个员工。
 * 接口只给 filingDates（已申请月份集合）与 approvalDates（每次审批时间集合），
 * 两者无法按索引一一对应，故不拆分、不配对，分别平铺到「申请月份」「申请时间」两列。
 */
interface LedgerRow {
  userName: string;
  userId: string | null;
  deptId: string;
  deptPath: string;
  hireDate: string;
  /** 该年度已申请月份（升序） */
  months: number[];
  /** 已申请月份文本，如 1-9月 */
  monthText: string;
  /** 该年度每次申请的审批时间，原样平铺 */
  applyTimes: string[];
  amount: number;
  remark: string;
}

/** 台账分组：同部门纵向合并 序号/部门 */
interface LedgerGroup {
  deptId: string;
  deptPath: string;
  firstApplyTime: string;
  rows: LedgerRow[];
}

interface MonthRun {
  start: number;
  end: number;
}

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" }
};

/** 部门树里顶层的管理口径节点，导出时省略，保留真实业务层级 */
const TOP_GROUPS = new Set(["前台", "中台", "后台", "集团管理中心"]);

/** 构建 deptId → 层级名称数组 */
const buildDeptPathMap = (tree: any[]): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  const walk = (nodes: any[], parents: string[]) => {
    (nodes || []).forEach(node => {
      if (!node) return;
      const name = node.deptName || String(node.deptId ?? "");
      const chain = [...parents, name];
      if (node.deptId !== undefined && node.deptId !== null) {
        map.set(String(node.deptId), chain);
      }
      walk(node.children || [], chain);
    });
  };
  walk(Array.isArray(tree) ? tree : [], []);
  return map;
};

/** deptId → "大市场部 / 内容营销CM / 营销视觉组"；查不到时回退 deptId */
const resolveDeptPath = (
  pathMap: Map<string, string[]>,
  deptId: string
): { path: string; known: boolean } => {
  const chain = deptId ? pathMap.get(deptId) : undefined;
  if (!chain || chain.length === 0) {
    return { path: deptId ? `部门${deptId}` : "部门信息缺失", known: false };
  }
  const path =
    chain[0] && TOP_GROUPS.has(chain[0])
      ? chain.slice(1).length
        ? chain.slice(1)
        : chain // 员工直接挂在顶层口径节点上时，保留该节点名称，避免部门列空白
      : chain.slice();
  return { path: path.join(" / "), known: true };
};

/** 从 filingDates（形如 2026-01）中提取年度月份，去重升序 */
const getFilingMonths = (filingDates: string[], year: number): number[] => {
  const set = new Set<number>();
  (filingDates || []).forEach(dateStr => {
    const text = String(dateStr);
    if (!text.startsWith(`${year}-`)) return;
    const month = Number(text.split("-")[1]);
    if (month >= 1 && month <= 12) set.add(month);
  });
  return [...set].sort((a, b) => a - b);
};

/** 连续月份切段：[1,2,3,5,6] → 1-3、5-6 */
const splitMonthRuns = (months: number[]): MonthRun[] => {
  const runs: MonthRun[] = [];
  months.forEach(month => {
    const last = runs[runs.length - 1];
    if (last && month === last.end + 1) {
      last.end = month;
    } else {
      runs.push({ start: month, end: month });
    }
  });
  return runs;
};

const formatMonthRange = (start: number, end: number) =>
  start === end ? `${start}月` : `${start}-${end}月`;

const formatMonthSet = (months: Set<number>) =>
  splitMonthRuns([...months].sort((a, b) => a - b))
    .map(run => formatMonthRange(run.start, run.end))
    .join("、");

/** userId → 入职日期（YYYY-MM-DD） */
const buildHireDateMap = (
  employees: FundExportEmployee[]
): Map<string, string> => {
  const map = new Map<string, string>();
  (employees || []).forEach(emp => {
    if (emp?.userId === undefined || emp?.userId === null) return;
    const key = String(emp.userId);
    if (!map.has(key) && emp.hireDate) {
      map.set(key, String(emp.hireDate).slice(0, 10));
    }
  });
  return map;
};

/** userId → 员工档案部门 id（列表树同源，用于经费接口部门 id 失效时兜底） */
const buildEmployeeDeptMap = (
  employees: FundExportEmployee[]
): Map<string, string> => {
  const map = new Map<string, string>();
  (employees || []).forEach(emp => {
    if (emp?.userId === undefined || emp?.userId === null) return;
    if (emp?.deptId === undefined || emp?.deptId === null) return;
    const key = String(emp.userId);
    if (!map.has(key)) map.set(key, String(emp.deptId));
  });
  return map;
};

/**
 * 选定用于反查部门名称的 deptId：
 * 1. 员工档案 department（/user/page，列表树用它，最新）能命中部门树则优先；
 * 2. 否则用经费接口 deptId（可能是已删除/合并的旧钉钉部门）；
 * 3. 都命中不了，仍优先展示档案部门 id，至少与列表树口径一致。
 */
const pickDeptId = (
  empDeptId: string,
  fundDeptId: string,
  pathMap: Map<string, string[]>
): string => {
  if (empDeptId && pathMap.has(empDeptId)) return empDeptId;
  if (fundDeptId && pathMap.has(fundDeptId)) return fundDeptId;
  return empDeptId || fundDeptId;
};

const fetchDeptTree = async (): Promise<any[]> => {
  try {
    const res: any = await getDeptTree();
    if (Array.isArray(res?.data)) return res.data;
    return Array.isArray(res) ? res : [];
  } catch (error) {
    console.warn("获取部门树失败，导出台账将使用 deptId 兜底:", error);
    return [];
  }
};

/**
 * 把经费接口数据还原成台账行：一个员工一行，月份与审批时间各自平铺、互不配对。
 * 后端不提供「一次申请覆盖哪几个月」的结构，前端不做任何推断拆分。
 */
const buildGroups = (
  fundList: Awaited<ReturnType<typeof getTeamBuildingExpenses>>,
  employees: FundExportEmployee[],
  pathMap: Map<string, string[]>,
  year: number
): LedgerGroup[] => {
  const hireDateMap = buildHireDateMap(employees);
  const employeeDeptMap = buildEmployeeDeptMap(employees);
  const groupMap = new Map<string, LedgerGroup>();

  fundList.forEach(item => {
    const months = getFilingMonths(item.filingDates || [], year);
    if (months.length === 0) return;

    const userId = item.userId != null ? String(item.userId) : null;
    const fundDeptId = item.deptId ? String(item.deptId) : "";
    const empDeptId = userId ? employeeDeptMap.get(userId) || "" : "";
    const deptId = pickDeptId(empDeptId, fundDeptId, pathMap);
    const { path: deptPath, known } = resolveDeptPath(pathMap, deptId);
    const hireDate = userId ? hireDateMap.get(userId) || "" : "";
    const applyTimes = [...new Set(item.approvalDates || [])].sort();

    const remarks: string[] = [];
    if (!userId) remarks.push("未注册账号");
    if (!known) remarks.push("部门信息缺失");

    const row: LedgerRow = {
      userName: item.userName || "未知员工",
      userId,
      deptId,
      deptPath,
      hireDate,
      months,
      monthText: formatMonthSet(new Set(months)),
      applyTimes,
      amount: months.length * MONTHLY_FUND,
      remark: remarks.join("；")
    };

    if (!groupMap.has(deptId)) {
      groupMap.set(deptId, {
        deptId,
        deptPath,
        firstApplyTime: "",
        rows: []
      });
    }
    const group = groupMap.get(deptId)!;
    const rowFirst = applyTimes[0];
    if (
      rowFirst &&
      (!group.firstApplyTime || rowFirst < group.firstApplyTime)
    ) {
      group.firstApplyTime = rowFirst;
    }
    group.rows.push(row);
  });

  const groups = [...groupMap.values()];
  groups.forEach(group => {
    group.rows.sort((a, b) => {
      const timeDiff = (a.applyTimes[0] || "").localeCompare(
        b.applyTimes[0] || ""
      );
      return timeDiff || a.userName.localeCompare(b.userName, "zh-Hans-CN");
    });
  });
  groups.sort((a, b) => {
    const keyDiff = a.firstApplyTime.localeCompare(b.firstApplyTime);
    return keyDiff || a.deptPath.localeCompare(b.deptPath, "zh-Hans-CN");
  });
  return groups;
};

const setCellStyle = (
  cell: ExcelJS.Cell,
  options: { wrapText?: boolean; bold?: boolean; size?: number } = {}
) => {
  cell.font = {
    name: FONT_NAME,
    size: options.size || 11,
    bold: !!options.bold
  };
  cell.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: !!options.wrapText
  };
  cell.border = THIN_BORDER;
};

/**
 * 台账 sheet：部门 → 人 → 申请月份 → 申请时间 → 经费。
 * 一人一行；申请月份与申请时间两列各自平铺接口原值，不做配对、不做批次拆分。
 */
const buildLedgerSheet = (
  workbook: ExcelJS.Workbook,
  groups: LedgerGroup[],
  year: number
) => {
  const worksheet = workbook.addWorksheet(`${year}年`);
  // 列序：序号 · 部门 · 姓名 · 申请月份 · 申请时间 · 经费 · 入职日期 · 备注
  const widths = [5.7, 30, 12, 14, 22, 11, 13, 20];
  widths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  worksheet.mergeCells("A1:H1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `${year}年团建费用台帐`;
  titleCell.font = { name: FONT_NAME, size: 14, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.getRow(1).height = 30;

  // 说明文字放在表格右侧（I 列），避免与「备注」列的表头重叠
  const noteCell = worksheet.getCell("I1");
  noteCell.value =
    "备注：每人每月60元；当月15日入职为节点，15前计算当月，15后次月开始计算。";
  noteCell.font = { name: FONT_NAME, size: 10, color: { argb: "FF888888" } };
  noteCell.alignment = { vertical: "middle", horizontal: "left" };

  const headers = [
    "序号",
    "部门",
    "姓名",
    "申请月份",
    "申请时间",
    "经费",
    "入职日期",
    "备注"
  ];
  const headerRow = worksheet.getRow(2);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    setCellStyle(cell, { bold: true });
  });
  headerRow.height = 22;
  worksheet.views = [{ state: "frozen", ySplit: 2 }];

  let cursor = 3;
  groups.forEach((group, groupIndex) => {
    const startRow = cursor;
    group.rows.forEach(row => {
      const excelRow = worksheet.getRow(cursor);
      // 申请时间：按接口原值逐条平铺（不推断哪条对应哪几个月）
      const timeLines = row.applyTimes.length ? row.applyTimes : ["—"];
      excelRow.getCell(1).value = groupIndex + 1;
      excelRow.getCell(2).value = group.deptPath;
      excelRow.getCell(3).value = row.userName;
      excelRow.getCell(4).value = row.monthText;
      excelRow.getCell(5).value = timeLines.join(String.fromCharCode(10));
      // 经费 = 该人已申请月数 × 60，数值型便于求和
      excelRow.getCell(6).value = row.amount;
      excelRow.getCell(7).value = row.hireDate;
      excelRow.getCell(8).value = row.remark;
      for (let col = 1; col <= 8; col++) {
        setCellStyle(excelRow.getCell(col), {
          wrapText: col === 2 || col === 3 || col === 4 || col === 5
        });
      }
      if (timeLines.length > 1) {
        excelRow.height = 16 * timeLines.length + 4;
      }
      cursor++;
    });
    const endRow = cursor - 1;
    if (endRow > startRow) {
      [1, 2].forEach(col => {
        worksheet.mergeCells(startRow, col, endRow, col);
        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
          worksheet.getCell(rowIndex, col).border = THIN_BORDER;
        }
      });
      [1, 2].forEach(col => {
        setCellStyle(worksheet.getCell(startRow, col), {
          wrapText: col === 2
        });
      });
    }
  });

  return worksheet;
};

/** 部门汇总 sheet：部门 / 人数 / 已申请月份 / 金额合计 */
const buildSummarySheet = (
  workbook: ExcelJS.Workbook,
  rows: LedgerRow[],
  year: number
) => {
  const worksheet = workbook.addWorksheet(`${year}年部门汇总`);
  [5.7, 34, 9, 22, 14, 20].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  worksheet.mergeCells("A1:F1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `${year}年团建经费申请汇总（按部门）`;
  titleCell.font = { name: FONT_NAME, size: 14, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.getRow(1).height = 30;

  const headers = [
    "序号",
    "部门",
    "人数",
    "已申请月份",
    "申请金额（元）",
    "备注"
  ];
  const headerRow = worksheet.getRow(2);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    setCellStyle(cell, { bold: true });
  });
  headerRow.height = 22;
  worksheet.views = [{ state: "frozen", ySplit: 2 }];

  const deptMap = new Map<
    string,
    {
      deptPath: string;
      people: Set<string>;
      months: Set<number>;
      amount: number;
    }
  >();
  const allMonths = new Set<number>();
  const allPeople = new Set<string>();
  let totalAmount = 0;

  rows.forEach(row => {
    const personKey = row.userId || `${row.userName}@${row.deptId}`;
    allPeople.add(personKey);
    totalAmount += row.amount;
    row.months.forEach(month => allMonths.add(month));

    if (!deptMap.has(row.deptPath)) {
      deptMap.set(row.deptPath, {
        deptPath: row.deptPath,
        people: new Set<string>(),
        months: new Set<number>(),
        amount: 0
      });
    }
    const dept = deptMap.get(row.deptPath)!;
    dept.people.add(personKey);
    dept.amount += row.amount;
    row.months.forEach(month => dept.months.add(month));
  });

  const depts = [...deptMap.values()].sort((a, b) =>
    a.deptPath.localeCompare(b.deptPath, "zh-Hans-CN")
  );

  let cursor = 3;
  depts.forEach((dept, index) => {
    const excelRow = worksheet.getRow(cursor);
    excelRow.getCell(1).value = index + 1;
    excelRow.getCell(2).value = dept.deptPath;
    excelRow.getCell(3).value = dept.people.size;
    excelRow.getCell(4).value = formatMonthSet(dept.months);
    excelRow.getCell(5).value = dept.amount;
    excelRow.getCell(6).value = "";
    for (let col = 1; col <= 6; col++) {
      setCellStyle(excelRow.getCell(col), {
        wrapText: col === 2 || col === 4
      });
    }
    cursor++;
  });

  // 合计行
  const totalRow = worksheet.getRow(cursor);
  totalRow.getCell(1).value = "";
  totalRow.getCell(2).value = "合计";
  totalRow.getCell(3).value = allPeople.size;
  totalRow.getCell(4).value = formatMonthSet(allMonths);
  totalRow.getCell(5).value = totalAmount;
  totalRow.getCell(6).value = "";
  for (let col = 1; col <= 6; col++) {
    setCellStyle(totalRow.getCell(col), { bold: true, wrapText: col === 4 });
  }

  return worksheet;
};

/**
 * 导出团建经费台账：
 * - 一个员工一行；申请月份与申请时间分成两列，各自平铺接口原值；
 * - 接口只给 filingDates（月份集合）与 approvalDates（审批时间集合），两者无法按索引对应，
 *   故前端不做批次推断、不拆行、不把月份和某次审批强行绑定；
 * - 经费 = 已申请月数 × 60（数值型，便于求和）；
 * - 序号 / 部门按部门纵向合并；另附按部门汇总 sheet。
 *
 * 未注册员工（无 userId）入职日期留空，并在备注标记。
 */
export const exportFundLedger = async (
  options: FundLedgerExportOptions = {}
): Promise<FundLedgerExportResult | null> => {
  const year = options.year || new Date().getFullYear();
  const [fundList, deptTree] = await Promise.all([
    getTeamBuildingExpenses(year),
    fetchDeptTree()
  ]);

  const groups = buildGroups(
    fundList,
    options.employees || [],
    buildDeptPathMap(deptTree),
    year
  );
  if (groups.length === 0) return null;

  const rows = groups.flatMap(group => group.rows);
  const people = new Set(
    rows.map(row => row.userId || `${row.userName}@${row.deptId}`)
  ).size;
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);

  const workbook = new ExcelJS.Workbook();
  buildLedgerSheet(workbook, groups, year);
  buildSummarySheet(workbook, rows, year);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(blob, `团建经费台账_${year}.xlsx`);

  return {
    people,
    rows: rows.length,
    groups: groups.length,
    totalAmount
  };
};
