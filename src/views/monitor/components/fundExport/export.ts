import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getDeptTree } from "@/api/pmApi";
import { getTeamBuildingExpenses } from "@/api/user";

/** 团建经费标准：每人每月 60 元（与手工台账一致） */
const MONTHLY_FUND = 60;
const FONT_NAME = "宋体";
/** 中文字体 charset，与手工台账保持一致 */
const FONT_CHARSET = 134;

/**
 * 模板复刻用的尺寸常量（均取自《团建费用台账.xlsx》2026年表）：
 * 默认行高 23、标题行 39、列宽见 LEDGER_COL_WIDTHS。
 */
const DEFAULT_ROW_HEIGHT = 23;
const TITLE_ROW_HEIGHT = 39;
const LEDGER_COL_WIDTHS = [
  5.66666666666667, 10.7777777777778, 13.1111111111111, 17.2222222222222,
  17.2222222222222, 17.2222222222222, 17.2222222222222, 17.2222222222222
];
const NOTE_COL_WIDTH = 18.6666666666667;

/** 台账标题下方右侧的说明文字（与手工台账一致） */
const LEDGER_NOTE =
  "备注：每人每月60元；当月15日入职为节点，15前计算当月，15后次月开始计算。";

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
  /** 台账行数（一人一次申请一行） */
  rows: number;
  /** 申请批次块数（合并块数） */
  groups: number;
  /** 申请金额合计 */
  totalAmount: number;
}

/**
 * 台账一行：一名员工的一次申请。
 * 批次 = (申请时间, 部门)，同一次申请的人归入同一块，合并 序号/申请时间/部门。
 */
interface LedgerRow {
  userName: string;
  userId: string | null;
  /** 人级唯一键（userId 或 姓名@部门），用于人数去重统计 */
  personKey: string;
  deptId: string;
  /** 部门展示文本，多层级用换行分隔（与手工台账一致） */
  deptPath: string;
  hireDate: string;
  /** 本次申请已覆盖月份（升序） */
  months: number[];
  /** 本次申请月份文本，如 1-9月 */
  monthText: string;
  /** 审批时间原文，如 "2026-06-01"；无则为空 */
  approvalDate: string;
  amount: number;
  remark: string;
}

/** 申请批次块：同一 (申请时间, 部门) 的所有人，序号/申请时间/部门纵向合并 */
interface LedgerBlock {
  key: string;
  deptId: string;
  deptPath: string;
  approvalDate: string;
  /** 用于排序的时间键（精确到天时就是日期本身） */
  sortTime: string;
  rows: LedgerRow[];
}

interface MonthRun {
  start: number;
  end: number;
}

/** 细边框：与模板一致，不指定颜色（Excel 按"自动"黑色处理） */
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

/**
 * deptId → 部门展示文本。与手工台账一致：多层级用换行分隔（如 "大市场部\n营销视觉组"）。
 * 查不到时回退 "部门{id}"，并标记 known=false。
 */
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
  return { path: path.join("\n"), known: true };
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

/** 把 "2026-06-01" / "2026-06" 统一成用于排序的键 */
const toSortTime = (approvalDate: string): string => approvalDate || "";

/**
 * 把经费接口数据还原成台账批次块。
 *
 * 批次口径与手工台账一致：**同一次申请 = 同一申请时间 + 同一部门**，
 * 该次申请涉及的所有人归入同一块，块内合并 序号/申请时间/部门。
 *
 * 每人可能有多次申请（如 5 月一次、9 月一次），分属不同块，各占一行。
 * 线上接口若只有扁平审批时间、无批次月份归属，则退化为「一人一块」，不做配对推断。
 */
const buildBlocks = (
  fundList: Awaited<ReturnType<typeof getTeamBuildingExpenses>>,
  employees: FundExportEmployee[],
  pathMap: Map<string, string[]>,
  year: number
): LedgerBlock[] => {
  const hireDateMap = buildHireDateMap(employees);
  const employeeDeptMap = buildEmployeeDeptMap(employees);
  const blockMap = new Map<string, LedgerBlock>();

  fundList.forEach(item => {
    const allMonths = getFilingMonths(item.filingDates || [], year);
    if (allMonths.length === 0) return;

    const userId = item.userId != null ? String(item.userId) : null;
    const userName = item.userName || "未知员工";
    const fundDeptId = item.deptId ? String(item.deptId) : "";
    const empDeptId = userId ? employeeDeptMap.get(userId) || "" : "";
    const deptId = pickDeptId(empDeptId, fundDeptId, pathMap);
    const { path: deptPath, known } = resolveDeptPath(pathMap, deptId);
    const hireDate = userId ? hireDateMap.get(userId) || "" : "";
    const personKey = userId || `${userName}@${deptId}`;

    const remarks: string[] = [];
    if (!userId) remarks.push("未注册账号");
    if (!known) remarks.push("部门信息缺失");
    const remark = remarks.join("；");

    // 拆分方案：按批次（申请时间 → 覆盖月份）拆行
    const batches = (item.batches || []).filter(
      batch => batch.filingDates.length > 0
    );
    const applies: { months: number[]; approvalDate: string }[] = [];
    if (batches.length > 0) {
      const claimed = new Set<number>();
      batches.forEach(batch => {
        const batchMonths = getFilingMonths(batch.filingDates, year);
        if (batchMonths.length === 0) return;
        batchMonths.forEach(month => claimed.add(month));
        applies.push({ months: batchMonths, approvalDate: batch.approvalDate });
      });
      // 兜底：批次未覆盖到的月份（数据不自洽时）单独成行，避免金额丢失
      const rest = allMonths.filter(month => !claimed.has(month));
      if (rest.length > 0) applies.push({ months: rest, approvalDate: "" });
    } else {
      // 无批次明细（线上扁平审批时间）：一人一行，多个审批时间用换行平铺
      applies.push({
        months: allMonths,
        approvalDate: [...new Set(item.approvalDates || [])].sort().join("\n")
      });
    }

    applies.forEach(apply => {
      // 批次键 = 申请时间 + 部门：同一次申请的人归到同一块
      const blockKey = `${apply.approvalDate}@@${deptId}`;
      if (!blockMap.has(blockKey)) {
        blockMap.set(blockKey, {
          key: blockKey,
          deptId,
          deptPath,
          approvalDate: apply.approvalDate,
          sortTime: toSortTime(apply.approvalDate),
          rows: []
        });
      }
      blockMap.get(blockKey)!.rows.push({
        userName,
        userId,
        personKey,
        deptId,
        deptPath,
        hireDate,
        months: apply.months,
        monthText: formatMonthSet(new Set(apply.months)),
        approvalDate: apply.approvalDate,
        amount: apply.months.length * MONTHLY_FUND,
        remark
      });
    });
  });

  const blocks = [...blockMap.values()];
  // 块内：同批次按姓名排列，便于校对
  blocks.forEach(block => {
    block.rows.sort((a, b) =>
      a.userName.localeCompare(b.userName, "zh-Hans-CN")
    );
  });
  // 块间：按申请时间升序，同一时间再按部门
  blocks.sort((a, b) => {
    const timeDiff = a.sortTime.localeCompare(b.sortTime);
    return timeDiff || a.deptPath.localeCompare(b.deptPath, "zh-Hans-CN");
  });
  return blocks;
};

/**
 * 单元格样式：宋体（charset 134，与模板一致）、居中、细边框。
 */
const setCellStyle = (
  cell: ExcelJS.Cell,
  options: {
    wrapText?: boolean;
    bold?: boolean;
    size?: number;
  } = {}
) => {
  cell.font = {
    name: FONT_NAME,
    size: options.size || 11,
    charset: FONT_CHARSET,
    scheme: "minor",
    // 模板字体颜色为「自动」（theme 1 = 深色文本）
    color: { theme: 1 },
    bold: !!options.bold
  };
  cell.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: !!options.wrapText
  };
  cell.border = THIN_BORDER;
};

/** 标题行：合并整行，宋体 12 加粗居中，行高 39（与手工台账一致） */
const styleTitleRow = (
  worksheet: ExcelJS.Worksheet,
  rowNumber: number,
  title: string,
  lastColumn: number
) => {
  const row = worksheet.getRow(rowNumber);
  row.getCell(1).value = title;
  if (lastColumn > 1) {
    worksheet.mergeCells(rowNumber, 1, rowNumber, lastColumn);
  }
  for (let col = 1; col <= lastColumn; col++) {
    const cell = row.getCell(col);
    cell.border = THIN_BORDER;
  }
  const cell = row.getCell(1);
  cell.font = {
    name: FONT_NAME,
    size: 12,
    charset: FONT_CHARSET,
    scheme: "minor",
    color: { theme: 1 },
    bold: true
  };
  cell.alignment = { vertical: "middle", horizontal: "center" };
  row.height = TITLE_ROW_HEIGHT;
};

/** 表头行：宋体 11，行高与模板一致（默认 23） */
const styleHeaderRow = (
  worksheet: ExcelJS.Worksheet,
  rowNumber: number,
  headers: string[]
) => {
  const row = worksheet.getRow(rowNumber);
  headers.forEach((header, index) => {
    const cell = row.getCell(index + 1);
    cell.value = header;
    setCellStyle(cell);
  });
  row.height = DEFAULT_ROW_HEIGHT;
};

/** 日期单元格格式：与手工台账一致（mm-dd-yy） */
const DATE_FMT = "mm-dd-yy";

/** 把 "2026-06-01" 转成 Date；只有年月（"2026-06"）时保持原文本，避免凭空补日 */
const toDateCellValue = (text: string): Date | string => {
  if (!text) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const [y, m, d] = text.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/**
 * 台账 sheet：与手工台账《团建费用台账.xlsx》一致。
 *
 * 列序：序号 · 申请时间 · 部门 · 姓名 · 入职日期 · 申请月份 · 申请金额 · 备注
 * 排序：按「申请时间」升序排列申请批次，同一次申请的人相邻成块。
 * 合并：序号 / 申请时间 / 部门 三列按批次块纵向合并（姓名不合并）。
 *
 * 注意：合并单元格只在左上角存值，开启筛选后块内其余行会被过滤掉。
 * 这是手工台账原有的结构，如需要可筛选的明细，请看导出的另一张汇总表或另行说明。
 */
const buildLedgerSheet = (
  workbook: ExcelJS.Workbook,
  blocks: LedgerBlock[],
  year: number
) => {
  const worksheet = workbook.addWorksheet(`${year}年`);
  // 行高/列宽与手工台账一致（默认行高 23，说明列在 K）
  worksheet.properties.defaultRowHeight = DEFAULT_ROW_HEIGHT;
  LEDGER_COL_WIDTHS.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });
  worksheet.getColumn(11).width = NOTE_COL_WIDTH;

  styleTitleRow(worksheet, 1, `${year}年团建费用台帐`, 8);

  // 说明文字放在 K1（与手工台账位置一致），无边框、左对齐
  const noteCell = worksheet.getCell("K1");
  noteCell.value = LEDGER_NOTE;
  noteCell.font = {
    name: FONT_NAME,
    size: 11,
    charset: FONT_CHARSET,
    scheme: "minor",
    color: { theme: 1 }
  };
  noteCell.alignment = { vertical: "middle", horizontal: "left" };

  styleHeaderRow(worksheet, 2, [
    "序号",
    "申请时间",
    "部门",
    "姓名",
    "入职日期",
    "申请月份",
    "申请金额",
    "备注"
  ]);

  let cursor = 3;
  blocks.forEach((block, blockIndex) => {
    const startRow = cursor;
    block.rows.forEach(row => {
      const excelRow = worksheet.getRow(cursor);
      // 姓名之后的 5 列逐行写值；序号/申请时间/部门由块合并，只写首行
      excelRow.getCell(4).value = row.userName;
      const hireCell = excelRow.getCell(5);
      hireCell.value = toDateCellValue(row.hireDate);
      excelRow.getCell(6).value = row.monthText;
      // 申请金额：与手工台账一致写成公式 =月数*60，便于核对
      excelRow.getCell(7).value = {
        formula: `${row.months.length}*${MONTHLY_FUND}`,
        result: row.amount
      };
      excelRow.getCell(8).value = row.remark;

      [4, 5, 6, 7, 8].forEach(col => {
        setCellStyle(excelRow.getCell(col));
      });
      // 备注列：模板为左对齐
      const remarkCell = excelRow.getCell(8);
      remarkCell.alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: false
      };
      // setCellStyle 会重建 font/alignment，日期格式需在样式之后再设，避免被覆盖。
      // 入职日期列无论是否有值都套用日期格式，与模板一致。
      hireCell.numFmt = DATE_FMT;
      cursor++;
    });

    const endRow = cursor - 1;
    const excelRow = worksheet.getRow(startRow);
    excelRow.getCell(1).value = blockIndex + 1;
    excelRow.getCell(3).value = block.deptPath;

    // 序号 / 申请时间 / 部门：块内合并，只画外框（中间行不画上下横线）
    [1, 2, 3].forEach(col => {
      // 关键：用 mergeCellsWithoutStyle，否则 ExcelJS 会把块内所有格子的样式
      // 统一成主单元格，导致逐行的外框边框全部丢失。
      if (endRow > startRow) {
        worksheet.mergeCellsWithoutStyle(startRow, col, endRow, col);
      }
      // 块内每一行都套上字体/对齐（模板中续行同样是宋体居中，
      // 只是不画上下横线），再逐格覆盖成「块外框」边框。
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
        setCellStyle(worksheet.getCell(rowIndex, col), {
          wrapText: col === 3
        });
        const cell = worksheet.getCell(rowIndex, col);
        cell.border = {
          top: rowIndex === startRow ? THIN_BORDER.top : undefined,
          bottom: rowIndex === endRow ? THIN_BORDER.bottom : undefined,
          left: THIN_BORDER.left,
          right: THIN_BORDER.right
        };
      }
    });

    // 申请时间：合并与样式都处理完再写值并设日期格式，确保不被覆盖。
    // 块内续行（合并区内的空格）也套日期格式，与模板保持一致。
    const timeCell = worksheet.getCell(startRow, 2);
    timeCell.value = toDateCellValue(block.approvalDate);
    if (/^\d{4}-\d{2}-\d{2}$/.test(block.approvalDate)) {
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
        worksheet.getCell(rowIndex, 2).numFmt = DATE_FMT;
      }
    }

    // 块内每行都显式设置行高 23（与模板一致），避免被默认行高或内容撑开
    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      worksheet.getRow(rowIndex).height = DEFAULT_ROW_HEIGHT;
    }
  });

  return worksheet;
};

/** 部门汇总 sheet：部门 / 人数 / 已申请月份 / 申请金额合计 */
const buildSummarySheet = (
  workbook: ExcelJS.Workbook,
  rows: LedgerRow[],
  year: number
) => {
  const worksheet = workbook.addWorksheet(`${year}年部门汇总`);
  // 行高/列宽与台账表同一口径，保持两个 sheet 观感一致
  worksheet.properties.defaultRowHeight = DEFAULT_ROW_HEIGHT;
  [5.66666666666667, 34, 9, 22, 16, 20].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  styleTitleRow(worksheet, 1, `${year}年团建经费申请汇总（按部门）`, 6);

  styleHeaderRow(worksheet, 2, [
    "序号",
    "部门",
    "人数",
    "已申请月份",
    "申请金额（元）",
    "备注"
  ]);
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
    allPeople.add(row.personKey);
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
    dept.people.add(row.personKey);
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

  // 合计行：加粗，与明细区分
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

  // 汇总表无合并单元格，可放心筛选（范围为明细行，不含合计行）
  worksheet.autoFilter = {
    from: { row: 2, column: 1 },
    to: { row: cursor - 1, column: 6 }
  };

  return worksheet;
};

/**
 * 导出团建经费台账（结构与《团建费用台账.xlsx》手工模板一致）：
 * - 列序：序号 · 申请时间 · 部门 · 姓名 · 入职日期 · 申请月份 · 申请金额 · 备注；
 * - 按「申请时间」升序排列申请批次，同一次申请（同时间+同部门）的人相邻成块；
 * - 序号 / 申请时间 / 部门 三列按批次块纵向合并，姓名不合并；
 * - 一次申请一行：申请月份取自该次申请覆盖的月份，金额为 月数 × 60；
 * - 样式为纯白底 + 细边框，宋体，与手工台账观感一致。
 *
 * 线上接口若只有扁平审批时间、无批次月份归属，则降级为「一人一行」，不做配对推断。
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

  const blocks = buildBlocks(
    fundList,
    options.employees || [],
    buildDeptPathMap(deptTree),
    year
  );
  if (blocks.length === 0) return null;

  const rows = blocks.flatMap(block => block.rows);
  // 一人可能因多批次拆成多行，按 personKey 去重统计人数
  const people = new Set(rows.map(row => row.personKey)).size;
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);

  const workbook = new ExcelJS.Workbook();
  buildLedgerSheet(workbook, blocks, year);
  buildSummarySheet(workbook, rows, year);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(blob, `团建经费台账_${year}.xlsx`);

  return {
    people,
    rows: rows.length,
    groups: blocks.length,
    totalAmount
  };
};
