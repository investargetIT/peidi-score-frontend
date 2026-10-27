import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getDeptTree } from "@/api/pmApi";
import { getTeamBuildingExpenses } from "@/api/user";

/** 团建经费标准：每人每月 60 元（与手工台账一致） */
const MONTHLY_FUND = 60;
const FONT_NAME = "宋体";

/** 员工信息（只需用到 userId / hireDate，兼容员工列表原始记录） */
export interface FundExportEmployee {
  userId?: string | number | null;
  hireDate?: string;
}

export interface FundLedgerExportOptions {
  /** 导出年度，默认当前年 */
  year?: number;
  /** 员工列表：用于按 userId 补入职日期（未注册员工补不到，留空） */
  employees?: FundExportEmployee[];
}

export interface FundLedgerExportResult {
  /** 员工人数（去重） */
  people: number;
  /** 台账行数 */
  rows: number;
  /** 批次（合并块）数 */
  groups: number;
  /** 申请金额合计 */
  totalAmount: number;
}

/** 台账一行：某员工某次连续月份的申请 */
interface LedgerRow {
  userName: string;
  userId: string | null;
  deptId: string;
  deptPath: string;
  hireDate: string;
  startMonth: number;
  endMonth: number;
  monthText: string;
  amount: number;
  remark: string;
}

/** 台账分组：相同「申请月 + 部门」合并 序号/申请时间/部门 */
interface LedgerGroup {
  endMonth: number;
  deptId: string;
  deptPath: string;
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
    chain[0] && TOP_GROUPS.has(chain[0]) ? chain.slice(1) : chain.slice();
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

/** 把经费接口数据还原成台账行，并按「申请月 + 部门」分组 */
const buildGroups = (
  fundList: Awaited<ReturnType<typeof getTeamBuildingExpenses>>,
  employees: FundExportEmployee[],
  pathMap: Map<string, string[]>,
  year: number
): LedgerGroup[] => {
  const hireDateMap = buildHireDateMap(employees);
  const groupMap = new Map<string, LedgerGroup>();

  fundList.forEach(item => {
    const months = getFilingMonths(item.filingDates || [], year);
    if (months.length === 0) return;

    const userId = item.userId != null ? String(item.userId) : null;
    const deptId = item.deptId ? String(item.deptId) : "";
    const { path: deptPath, known } = resolveDeptPath(pathMap, deptId);
    const hireDate = userId ? hireDateMap.get(userId) || "" : "";

    splitMonthRuns(months).forEach(run => {
      const monthCount = run.end - run.start + 1;
      const remarks: string[] = [];
      if (!userId) remarks.push("未注册账号");
      if (!known) remarks.push("部门信息缺失");

      const row: LedgerRow = {
        userName: item.userName || "未知员工",
        userId,
        deptId,
        deptPath,
        hireDate,
        startMonth: run.start,
        endMonth: run.end,
        monthText: formatMonthRange(run.start, run.end),
        amount: monthCount * MONTHLY_FUND,
        remark: remarks.join("；")
      };

      const groupKey = `${run.end}|${deptId}`;
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          endMonth: run.end,
          deptId,
          deptPath,
          rows: []
        });
      }
      groupMap.get(groupKey)!.rows.push(row);
    });
  });

  const groups = [...groupMap.values()];
  groups.forEach(group => {
    group.rows.sort((a, b) =>
      a.userName.localeCompare(b.userName, "zh-Hans-CN")
    );
  });
  groups.sort(
    (a, b) =>
      a.endMonth - b.endMonth ||
      a.deptPath.localeCompare(b.deptPath, "zh-Hans-CN")
  );
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

/** 台账 sheet：标题 + 表头 + 按批次纵向合并的数据行 */
const buildLedgerSheet = (
  workbook: ExcelJS.Workbook,
  groups: LedgerGroup[],
  year: number
) => {
  const worksheet = workbook.addWorksheet(`${year}年`);
  const widths = [5.7, 12, 32, 16, 13, 11, 11, 18];
  widths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  worksheet.mergeCells("A1:H1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `${year}年团建费用台帐`;
  titleCell.font = { name: FONT_NAME, size: 14, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.getRow(1).height = 30;

  const noteCell = worksheet.getCell("I1");
  noteCell.value =
    "备注：每人每月60元；当月15日入职为节点，15前计算当月，15后次月开始计算。";
  noteCell.font = { name: FONT_NAME, size: 10, color: { argb: "FF888888" } };
  noteCell.alignment = { vertical: "middle", horizontal: "left" };

  const headers = [
    "序号",
    "申请时间",
    "部门",
    "姓名",
    "入职日期",
    "申请月份",
    "申请金额",
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
      excelRow.getCell(1).value = groupIndex + 1;
      excelRow.getCell(2).value =
        `${year}-${String(group.endMonth).padStart(2, "0")}`;
      excelRow.getCell(3).value = group.deptPath;
      excelRow.getCell(4).value = row.userName;
      excelRow.getCell(5).value = row.hireDate;
      excelRow.getCell(6).value = row.monthText;
      excelRow.getCell(7).value = row.amount;
      excelRow.getCell(8).value = row.remark;
      for (let col = 1; col <= 8; col++) {
        setCellStyle(excelRow.getCell(col), {
          wrapText: col === 3 || col === 4 || col === 8
        });
      }
      cursor++;
    });
    const endRow = cursor - 1;
    if (endRow > startRow) {
      // 序号 / 申请时间 / 部门 三列按批次纵向合并
      [1, 2, 3].forEach(col => {
        worksheet.mergeCells(startRow, col, endRow, col);
        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
          worksheet.getCell(rowIndex, col).border = THIN_BORDER;
        }
      });
      [1, 2, 3].forEach(col => {
        setCellStyle(worksheet.getCell(startRow, col), {
          wrapText: col === 3
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
    for (let month = row.startMonth; month <= row.endMonth; month++) {
      allMonths.add(month);
    }

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
    for (let month = row.startMonth; month <= row.endMonth; month++) {
      dept.months.add(month);
    }
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
 * 导出团建经费台账（方案 A）：
 * - 按「连续申请月份 + 部门」还原申请批次，纵向合并序号/申请时间/部门；
 * - 申请金额 = 月数 × 60；
 * - 另附按部门汇总 sheet。
 *
 * 数据限制：经费接口 filingDates 只到「年月」，故申请时间输出 YYYY-MM；
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
