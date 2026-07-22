import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ElMessage } from "element-plus";
import { getFileDownLoadPath } from "@/api/esg";
import type { CachedUserData, CachedFieldInfo } from "./index";

/**
 * 导出 ESG 填报总览到 Excel (使用 exceljs，功能更强大)
 * @param selectedYear 选中的年份
 * @param currentYearConfig 当前年份配置
 * @param cachedUserDataList 缓存的用户数据列表
 * @param getCachedFieldInfo 获取缓存字段信息的函数
 */
export async function exportEsgToExcel(
  selectedYear: number | null,
  currentYearConfig: any,
  cachedUserDataList: CachedUserData[],
  getCachedFieldInfo: (
    cachedUser: CachedUserData,
    tabId: string,
    cardId: string,
    fieldId: string
  ) => CachedFieldInfo
) {
  if (!currentYearConfig) {
    ElMessage.warning("请先选择年份");
    return false;
  }
  if (cachedUserDataList.length === 0) {
    ElMessage.warning("当前年份暂无数据");
    return false;
  }

  try {
    // 创建 workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "ESG 填报系统";
    workbook.lastModifiedBy = "ESG 填报系统";
    workbook.created = new Date();
    workbook.modified = new Date();

    const baseHost = window.location.origin;
    const apiBaseUrl = import.meta.env.VITE_API_URL || "";
    const baseUrl = apiBaseUrl ? apiBaseUrl : baseHost;

    // 默认字体样式 - 微软雅黑
    const defaultFont = {
      name: "微软雅黑",
      size: 11,
      color: { argb: "FF000000" }
    };

    // 表头样式
    const headerFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4268F9" }
    };
    const headerFont = {
      name: "微软雅黑",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" }
    };
    const headerStyle = {
      font: headerFont,
      fill: headerFill,
      alignment: {
        vertical: "middle",
        horizontal: "center"
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      }
    };

    // 普通单元格样式
    const cellStyle = {
      font: defaultFont,
      alignment: {
        vertical: "top",
        wrapText: true
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      }
    };

    // 遍历每个 Tab，每个 Tab 对应一个 sheet
    for (const tab of currentYearConfig.tabs) {
      if (!tab.cards || tab.cards.length === 0) continue;

      // 先检查每个用户是否有至少一个非空单元格，全空排除
      const userHasData: boolean[] = [];
      cachedUserDataList.forEach(() => userHasData.push(false));

      // 预扫描，找出有数据的用户
      for (const card of tab.cards) {
        if (!card.fields) continue;
        for (const field of card.fields) {
          cachedUserDataList.forEach((cachedUser, idx) => {
            const info = getCachedFieldInfo(cachedUser, tab.tabId, card.cardId, field.fieldId);
            if (info.value || (info.hasFile && info.fileList.length > 0)) {
              userHasData[idx] = true;
            }
          });
        }
      }

      // 过滤出有数据的用户
      const filteredUsers = cachedUserDataList.filter((_, idx) => userHasData[idx]);
      if (filteredUsers.length === 0) continue; // 整个 sheet 都没数据跳过

      // 添加 sheet
      const worksheet = workbook.addWorksheet((tab.tabName || "Sheet" + tab.tabId).slice(0, 31));

      // 设置列宽
      const columnWidths = [
        { width: 22 },  // 卡片名称
        { width: 32 },  // 字段名称
        ...filteredUsers.map(() => ({ width: 38 })) // 每个用户一列
      ];
      worksheet.columns = columnWidths;

      // 添加表头
      const headerRow = worksheet.addRow([]);
      const headerCells = ["卡片名称", "字段名称"];
      filteredUsers.forEach(cachedUser => {
        headerCells.push(cachedUser.user.userName || "用户 " + cachedUser.user.userId);
      });
      headerCells.forEach((cell, idx) => {
        headerRow.getCell(idx + 1).value = cell;
        headerRow.getCell(idx + 1).style = headerStyle;
      });
      headerRow.height = 24;

      // 遍历每个卡片，记录卡片起始行，用于后续合并单元格
      let currentRowNum = 2; // 从第2行开始（表头是第1行）
      const cardMergeRanges: Array<{startRow: number, endRow: number}> = [];

      for (const card of tab.cards) {
        if (!card.fields || card.fields.length === 0) continue;

        const cardStartRow = currentRowNum;
        const fieldCount = card.fields.length;

        // 遍历每个字段
        for (const field of card.fields) {
          const row = worksheet.addRow([]);
          // 第一列：卡片名称
          row.getCell(1).value = card.cardName;
          row.getCell(1).style = cellStyle;
          // 第二列：字段名称
          row.getCell(2).value = field.label;
          row.getCell(2).style = cellStyle;

          // 每个用户一列
          let colNum = 3;
          for (const cachedUser of filteredUsers) {
            const info = getCachedFieldInfo(cachedUser, tab.tabId, card.cardId, field.fieldId);
            const cell = row.getCell(colNum);
            cell.style = cellStyle;

            if (info.hasFile && info.fileList.length > 0) {
              // 附件：多个文件换行，每个都是超链接
              let text = "";
              for (const file of info.fileList) {
                try {
                  // 请求获取真实下载地址
                  const res = await getFileDownLoadPath({ objectName: file.url });
                  if (res.success && res.data) {
                    let fullUrl = res.data;
                    if (!fullUrl.startsWith("http")) {
                      fullUrl = baseUrl.replace(/\/$/, "") + "/" + fullUrl.replace(/^\//, "");
                    }
                    // 添加超链接
                    if (text) text += "\n";
                    text += file.name;
                    cell.value = text;
                    cell.hyperlink = fullUrl;
                  } else {
                    if (text) text += "\n";
                    text += file.name;
                    cell.value = text;
                  }
                } catch (e) {
                  if (text) text += "\n";
                  text += file.name;
                  cell.value = text;
                }
              }
            } else if (info.value) {
              // 普通文本
              cell.value = info.value;
            } else {
              cell.value = "";
            }
            colNum++;
          }

          currentRowNum++;
        }

        // 如果卡片有多个字段，合并A列（卡片名称）
        if (fieldCount > 1) {
          cardMergeRanges.push({
            startRow: cardStartRow,
            endRow: currentRowNum - 1
          });
          // 第一个单元格已经设置了值，后面的单元格保持空，但会合并
        }
      }

      // 执行合并单元格（A列）
      for (const merge of cardMergeRanges) {
        worksheet.mergeCells("A" + merge.startRow + ":A" + merge.endRow);
        // 重新设置样式（合并后保持样式）
        const mergedCell = worksheet.getCell("A" + merge.startRow);
        mergedCell.style = cellStyle;
        mergedCell.alignment = {
          vertical: "middle",
          horizontal: "center"
        };
      }

      // 设置所有单元格自动换行
      worksheet.columns.forEach(column => {
        column.eachCell({ includeEmpty: true }, cell => {
          if (cell.style && cell.style.alignment) {
            cell.style.alignment.wrapText = true;
          }
        });
      });
    }

    // 生成并下载
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = selectedYear + "年 ESG 填报总览.xlsx";
    saveAs(blob, fileName);

    ElMessage.success("导出成功");
    return true;
  } catch (error) {
    console.error("导出失败", error);
    ElMessage.error("导出失败，请重试");
    return false;
  }
}

