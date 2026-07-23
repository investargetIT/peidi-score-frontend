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

    // 超链接单元格样式 - 蓝色下划线
    const linkFont = {
      ...defaultFont,
      color: { argb: "FF0000FF" },
      underline: true
    };
    const linkCellStyle = {
      ...cellStyle,
      font: linkFont
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
            const info = getCachedFieldInfo(
              cachedUser,
              tab.tabId,
              card.cardId,
              field.fieldId
            );
            if (info.value || (info.hasFile && info.fileList.length > 0)) {
              userHasData[idx] = true;
            }
          });
        }
      }

      // 过滤出有数据的用户
      const filteredUsers = cachedUserDataList.filter(
        (_, idx) => userHasData[idx]
      );
      if (filteredUsers.length === 0) continue; // 整个 sheet 都没数据跳过

      // 添加 sheet
      const worksheet = workbook.addWorksheet(
        (tab.tabName || "Sheet" + tab.tabId).slice(0, 31)
      );

      // 设置列宽
      const columnWidths = [
        { width: 22 }, // 卡片名称
        { width: 32 }, // 字段名称
        ...filteredUsers.map(() => ({ width: 38 })) // 每个用户一列
      ];
      worksheet.columns = columnWidths;

      // 添加表头
      const headerRow = worksheet.addRow([]);
      const headerCells = ["卡片名称", "字段名称"];
      filteredUsers.forEach(cachedUser => {
        headerCells.push(
          cachedUser.user.userName || "用户 " + cachedUser.user.userId
        );
      });
      headerCells.forEach((cell, idx) => {
        headerRow.getCell(idx + 1).value = cell;
        headerRow.getCell(idx + 1).style = headerStyle;
      });
      headerRow.height = 24;

      // 遍历每个卡片，记录卡片起始行，用于后续合并单元格
      let currentRowNum = 2; // 从第2行开始（表头是第1行）
      const cardMergeRanges: Array<{ startRow: number; endRow: number }> = [];
      const fieldMergeRanges: Array<{
        startRow: number;
        endRow: number;
        col: number;
      }> = [];

      for (const card of tab.cards) {
        if (!card.fields || card.fields.length === 0) continue;

        const cardStartRow = currentRowNum;
        let totalFieldRows = 0;

        // 遍历每个字段
        for (const field of card.fields) {
          const fieldStartRow = currentRowNum;
          let fileCount = 0;

          // 计算这个字段需要多少行：检查所有用户中最大附件数量
          let maxFiles = 1;
          for (const cachedUser of filteredUsers) {
            const info = getCachedFieldInfo(
              cachedUser,
              tab.tabId,
              card.cardId,
              field.fieldId
            );
            if (info.hasFile && info.fileList.length > 0) {
              maxFiles = Math.max(maxFiles, info.fileList.length);
            }
          }

          // 为每个附件创建单独一行
          for (let fileIndex = 0; fileIndex < maxFiles; fileIndex++) {
            const row = worksheet.addRow([]);
            // 第一列：卡片名称（只在第一行写，后续合并）
            if (fileIndex === 0) {
              row.getCell(1).value = card.cardName;
              row.getCell(1).style = cellStyle;
            } else {
              row.getCell(1).style = cellStyle;
            }
            // 第二列：字段名称（只在第一行写，后续合并）
            if (fileIndex === 0) {
              row.getCell(2).value = field.label;
              row.getCell(2).style = cellStyle;
            } else {
              row.getCell(2).style = cellStyle;
            }

            // 每个用户一列
            let colNum = 3;
            for (const cachedUser of filteredUsers) {
              const info = getCachedFieldInfo(
                cachedUser,
                tab.tabId,
                card.cardId,
                field.fieldId
              );
              const cell = row.getCell(colNum);

              if (
                info.hasFile &&
                info.fileList.length > 0 &&
                fileIndex < info.fileList.length
              ) {
                // 单个文件放一个单元格
                const file = info.fileList[fileIndex];
                try {
                  // 跟预览逻辑完全一致：请求获取阿里OSS真实下载地址
                  const res = await getFileDownLoadPath({
                    objectName: file.url
                  });

                  // 接口返回结构就是 res.data = "https://..."，直接取
                  let fullUrl: string;
                  if (res && res.data) {
                    fullUrl = String(res.data);
                  } else if (typeof res === "string") {
                    fullUrl = res;
                  } else {
                    fullUrl = file.url;
                  }

                  // 直接放完整URL文本
                  cell.value = fullUrl;
                  // 如果是绝对路径，使用蓝色超链接样式
                  if (fullUrl.startsWith("http")) {
                    cell.style = linkCellStyle;
                  } else {
                    cell.style = cellStyle;
                  }
                } catch (e) {
                  // 出错 fallback，直接显示URL文本
                  cell.value = file.url;
                  cell.style = cellStyle;
                }
              } else if (fileIndex === 0 && info.value) {
                // 普通文本只放在第一行
                cell.value = info.value;
                cell.style = cellStyle;
              } else {
                cell.value = "";
                cell.style = cellStyle;
              }
              colNum++;
            }

            currentRowNum++;
            fileCount++;
          }

          totalFieldRows += fileCount;

          // 如果一个字段分成了多行，需要合并B列（字段名称）
          if (fileCount > 1) {
            fieldMergeRanges.push({
              startRow: fieldStartRow,
              endRow: currentRowNum - 1,
              col: 2 // 第二列是字段名称
            });
          }

          // 也记录需要合并的用户列（如果该用户有多个附件）
          // 实际上用户列每个附件已经单独一行了，不需要合并
        }

        // 如果卡片有多个字段行，合并A列（卡片名称）
        if (totalFieldRows > 1) {
          cardMergeRanges.push({
            startRow: cardStartRow,
            endRow: currentRowNum - 1
          });
          // 第一个单元格已经设置了值，后面的单元格保持空，合并后显示正确
        }
      }

      // 执行合并单元格

      // 合并A列（卡片名称）
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

      // 合并B列（字段名称）- 一个字段多个附件时
      for (const merge of fieldMergeRanges) {
        const colLetter = String.fromCharCode(64 + merge.col); // B列 = 65+1=66 = 'B'
        worksheet.mergeCells(
          colLetter + merge.startRow + ":" + colLetter + merge.endRow
        );
        // 重新设置样式（合并后保持样式）
        const mergedCell = worksheet.getCell(colLetter + merge.startRow);
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
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
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
