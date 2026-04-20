import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ElMessage } from "element-plus";

/**
 * 积分记录数据结构
 */
export interface ScoreRecord {
  siteName: string; // 公司名称
  userName: string; // 姓名
  email: string; // 邮箱
  education: string; // 学历
  hireDate: string; // 入职日期
  lifeTimePoints: number; // 累计积分
  redeemablePoints: number; // 可用积分
  history: string; // 积分历史（多行文本）
}

/**
 * 导出积分记录到 Excel
 * @param data 积分记录数组
 * @param fileName 文件名（可选，默认包含时间戳）
 */
export const exportScoreHistoryToExcel = async (
  data: ScoreRecord[],
  fileName?: string
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("积分记录");

    // 设置列宽
    worksheet.columns = [
      { header: "公司名称", key: "siteName", width: 15 },
      { header: "姓名", key: "userName", width: 15 },
      { header: "邮箱", key: "email", width: 25 },
      { header: "学历", key: "education", width: 15 },
      { header: "入职日期", key: "hireDate", width: 15 },
      { header: "长期积分", key: "lifeTimePoints", width: 12 },
      { header: "可兑换积分", key: "redeemablePoints", width: 12 },
      { header: "积分历史", key: "history", width: 80 }
    ];

    // 设置表头样式
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4CAF50" }
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // 启用自动筛选（包含所有列）
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 8 }
    };

    // 添加数据行
    data.forEach((item, index) => {
      const row = worksheet.getRow(index + 2);
      row.values = {
        siteName: item.siteName,
        userName: item.userName,
        email: item.email,
        education: item.education,
        hireDate: item.hireDate,
        lifeTimePoints: item.lifeTimePoints,
        redeemablePoints: item.redeemablePoints,
        history: item.history
      };

      // 设置数据行样式
      row.eachCell(cell => {
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
    });

    // 生成文件名
    const defaultFileName = `积分记录_${new Date().getTime()}.xlsx`;
    const finalFileName = fileName || defaultFileName;

    // 导出文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(blob, finalFileName);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败：" + (error as Error).message);
  }
};
