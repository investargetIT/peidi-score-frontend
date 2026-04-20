import { baseUrlApi, getEsgRuleDetail } from "@/api/esg";
import { ElMessage } from "element-plus";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatToken, getToken } from "@/utils/auth";
import { EXCEL_CONFIG } from "./config";
import { userNameToRegion } from "../../components/utils/config";

// ESG 模块配置列表
const ESG_MODULES = [
  {
    name: "company-overview",
    sheetName: "公司概况"
  },
  {
    name: "corporate-governance",
    sheetName: "公司治理"
  },
  {
    name: "esg-management",
    sheetName: "ESG管理"
  },
  {
    name: "business-operations",
    sheetName: "产业发展与运营"
  },
  {
    name: "quality-food-safety",
    sheetName: "质量与食品安全管理"
  },
  {
    name: "supplier-management",
    sheetName: "供应链管理"
  },
  {
    name: "information-security-privacy",
    sheetName: "信息安全与隐私保护"
  },
  { name: "employees", sheetName: "员工" },
  {
    name: "environmental-impact",
    sheetName: "环境影响"
  },
  { name: "community-welfare", sheetName: "回馈社会" }
];

/**
 * 获取单个模块的 ESG 数据
 * @param moduleName 模块名称
 * @param year 年份
 * @returns 模块数据
 */
async function fetchEsgModuleData(moduleName: string, year: string) {
  try {
    const response: any = await getEsgRuleDetail({
      type: moduleName,
      year: year
    });

    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error(`获取模块 ${moduleName} 数据失败:`, error);
    throw new Error(`获取模块 ${moduleName} 数据失败`);
  }
}

/**
 * 获取所有 ESG 模块的数据
 * @param year 年份
 * @returns 包含所有模块数据的 Map
 */
async function fetchAllEsgModulesData(year: string) {
  const modulesDataMap = new Map();

  // 并发请求所有模块数据
  const fetchPromises = ESG_MODULES.map(async module => {
    try {
      const data = await fetchEsgModuleData(module.name, year);
      modulesDataMap.set(module.name, data);
      return { success: true, moduleName: module.name };
    } catch (error) {
      console.error(`加载模块 ${module.sheetName} 失败:`, error);
      return { success: false, moduleName: module.name, error };
    }
  });

  // 等待所有请求完成
  const results = await Promise.all(fetchPromises);

  // 统计结果
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log(
    `ESG 数据加载完成：成功 ${successCount}/${ESG_MODULES.length} 个模块，失败 ${failCount} 个模块`
  );

  if (failCount > 0) {
    ElMessage.warning(
      `部分模块数据加载失败 (${failCount}/${ESG_MODULES.length})，已跳过这些模块`
    );
  }

  return modulesDataMap;
}

/**
 * 合并多个用户的 ESG 数据
 * @param userDataRecords 用户数据记录数组
 * @returns 合并后的数据对象
 */
function mergeUserData(userDataRecords): Record<string, any> {
  const mergedData: Record<string, any[]> = {};

  userDataRecords.forEach(item => {
    try {
      const contentData = JSON.parse(item.content);

      // 将相同字段的内容拼接起来
      Object.keys(contentData).forEach(key => {
        if (!mergedData[key]) {
          mergedData[key] = [];
        }

        const value = contentData[key];

        // 如果是字符串且不为空，则添加用户名前缀
        if (typeof value === "string" && value.trim()) {
          mergedData[key].push(
            `${userNameToRegion[item.userName] || "未指定地区"}-${item.userName}: ${value}`
          );
        } else if (Array.isArray(value)) {
          // 如果是数组，保留原始结构
          mergedData[key].push(...value);
        } else if (value !== null && value !== undefined && value !== "") {
          // 其他类型（数字、布尔值等）直接添加，排除空字符串
          mergedData[key].push(value);
        }
      });
    } catch (e) {
      console.warn("解析 content 数据失败:", e, item);
    }
  });

  return mergedData;
}

/**
 * 批量将相对路径转换为绝对路径
 * @param relativePaths 相对路径数组，如 ["\esg\1.png", "\esg\2.png"]
 * @returns 绝对路径数组，如 ["https://api.peidigroup.cn/esg/1.png", "https://api.peidigroup.cn/esg/2.png"]
 */
async function convertToAbsoluteUrls(
  relativePaths: string[]
): Promise<string[]> {
  if (!relativePaths || relativePaths.length === 0) {
    return [];
  }

  const processedUrls = await Promise.all(
    relativePaths.map(async relativePath => {
      if (!relativePath) return "";

      try {
        const response = await fetch(
          baseUrlApi(
            `/common/download-url?objectName=${encodeURIComponent(relativePath)}`
          ),
          {
            headers: {
              Authorization: formatToken(getToken().accessToken)
            }
          }
        );

        if (response.ok) {
          const jsonResponse = await response.json();
          return jsonResponse.data;
        }
      } catch (error) {
        console.error("获取文件失败:", error);
      }

      return relativePath; // 如果获取失败，返回原始路径
    })
  );

  return processedUrls;
}

//#region excel.js
/**
 * 使用 ExcelJS 创建工作表（美化版）
 * @param worksheet ExcelJS 工作表对象
 * @param data 数据数组
 * @param sheetName 工作表名称
 */
async function createExcelJSWorksheet(
  worksheet: ExcelJS.Worksheet,
  data: any[],
  sheetName: string
) {
  // 设置工作表视图
  worksheet.views = [{ state: "frozen", ySplit: 2 }];

  // 添加大标题
  const titleRow = worksheet.getRow(1);
  titleRow.values = [sheetName];
  worksheet.mergeCells("A1:B1");
  titleRow.height = 35;

  const titleCell = titleRow.getCell(1);
  titleCell.font = {
    bold: true,
    size: 18,
    color: { argb: "FFFFFFFF" },
    name: "微软雅黑"
  };
  titleCell.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true
  };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4F81BD" }
  };
  titleCell.border = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } }
  };

  // 添加列标题
  const headerRow = worksheet.getRow(2);
  headerRow.values = ["指标", "内容"];
  headerRow.height = 25;

  for (let i = 1; i <= 2; i++) {
    const cell = headerRow.getCell(i);
    cell.font = {
      bold: true,
      size: 12,
      color: { argb: "FFFFFFFF" },
      name: "微软雅黑"
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF7F9BC7" }
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
  }

  // 设置列宽
  worksheet.columns = [{ width: 25 }, { width: 80 }];

  // 添加数据行
  let currentRow = 3;
  for (const item of data) {
    const row = worksheet.getRow(currentRow);

    // 检查 content 是否包含超链接信息
    const hasHyperlinks =
      item.content &&
      typeof item.content === "object" &&
      item.content.hyperlinks;

    if (hasHyperlinks) {
      // 设置标题和文本内容
      row.values = [item.title, item.content.text];

      // 设置行高（根据内容长度动态调整）
      const contentLines = item.content.text
        ? String(item.content.text).split("\n").length
        : 1;
      row.height = Math.max(25, 20 + contentLines * 18);
    } else {
      row.values = [item.title, item.content];

      // 设置行高（根据内容长度动态调整）
      const contentLines = item.content
        ? String(item.content).split("\n").length
        : 1;
      row.height = Math.max(25, 20 + contentLines * 18);
    }

    // 设置标题列样式
    const titleCell = row.getCell(1);
    titleCell.font = {
      bold: true,
      size: 11,
      color: { argb: "FF1F4E79" },
      name: "微软雅黑"
    };
    titleCell.alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true
    };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF2F2F2" }
    };
    titleCell.border = {
      top: { style: "thin", color: { argb: "FFD0D0D0" } },
      left: { style: "thin", color: { argb: "FFD0D0D0" } },
      bottom: { style: "thin", color: { argb: "FFD0D0D0" } },
      right: { style: "thin", color: { argb: "FFD0D0D0" } }
    };

    // 设置内容列样式
    const contentCell = row.getCell(2);
    contentCell.font = {
      size: 11,
      name: "微软雅黑"
    };
    contentCell.alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true
    };
    contentCell.border = {
      top: { style: "thin", color: { argb: "FFD0D0D0" } },
      left: { style: "thin", color: { argb: "FFD0D0D0" } },
      bottom: { style: "thin", color: { argb: "FFD0D0D0" } },
      right: { style: "thin", color: { argb: "FFD0D0D0" } }
    };

    // 如果内容包含超链接，使用富文本格式
    if (
      hasHyperlinks &&
      item.content.hyperlinks &&
      item.content.hyperlinks.length > 0
    ) {
      const richText = [];
      const lines = item.content.text.split("\n");

      lines.forEach((line, lineIdx) => {
        if (lineIdx > 0) {
          richText.push({ text: "\n" });
        }

        // 查找该行是否有超链接
        const hyperlink = item.content.hyperlinks.find(
          h => h.lineIndex === lineIdx
        );

        if (hyperlink) {
          // 提取序号部分（如 "1. "）
          const match = line.match(/^(\d+\.\s)/);
          if (match) {
            // 添加序号部分（普通文本）
            richText.push({ text: match[1] });
            // 添加 URL 部分（超链接）
            richText.push({
              text: line.substring(match[1].length),
              hyperlink: hyperlink.url,
              font: {
                size: 11,
                name: "微软雅黑",
                color: { argb: "FF0563C1" },
                underline: true
              }
            });
          } else {
            // 如果没有序号，整个文本都是超链接
            richText.push({
              text: line,
              hyperlink: hyperlink.url,
              font: {
                size: 11,
                name: "微软雅黑",
                color: { argb: "FF0563C1" },
                underline: true
              }
            });
          }
        } else {
          richText.push({ text: line });
        }
      });

      contentCell.value = { richText };
    }

    // 如果是偶数行，添加浅灰色背景
    if (currentRow % 2 === 0) {
      contentCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFAFAFA" }
      };
    }

    currentRow++;
  }

  // 再次检查所有行的合并单元格
  // worksheet.mergeCells("A1:B1");
}

/**
 * 处理附件数据，将多个 URL 分行显示
 * @param attachments 附件 URL 数组
 * @returns 格式化后的文本，每个 URL 占一行
 */
function formatAttachmentsForExcel(attachments: string[]) {
  if (!attachments || attachments.length === 0) {
    return { text: "", hyperlinks: [] };
  }

  // 如果有多个附件，每个占一行并添加序号
  if (attachments.length > 1) {
    const text = attachments
      .map((url, index) => `${index + 1}. ${url}`)
      .join("\n");
    const hyperlinks = attachments.map((url, index) => ({
      lineIndex: index,
      url: url
    }));
    return { text, hyperlinks };
  }

  return {
    text: attachments[0] || "",
    hyperlinks: attachments[0] ? [{ lineIndex: 0, url: attachments[0] }] : []
  };
}

/**
 * 使用 ExcelJS 导出所有 ESG 数据到 Excel（美化版）
 * @param year 年份
 */
export async function exportAllEsgDataWithExcelJS(year: string) {
  try {
    ElMessage.info(`正在加载 ${year} 年 ESG 数据...`);

    // 1. 获取所有模块数据
    const modulesDataMap = await fetchAllEsgModulesData(year);

    if (modulesDataMap.size === 0) {
      ElMessage.error("未获取到任何 ESG 数据");
      return;
    }

    // 2. 创建工作簿
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "ESG 系统";
    workbook.created = new Date();
    workbook.lastPrinted = new Date();

    // 3. 遍历每个模块，处理数据并添加到工作簿
    for (const module of ESG_MODULES) {
      const userDataRecords = modulesDataMap.get(module.name);

      if (!userDataRecords || userDataRecords.length === 0) {
        console.warn(`模块 ${module.sheetName} 无数据，跳过`);
        continue;
      }

      try {
        // 合并用户数据
        const mergedData = mergeUserData(userDataRecords);

        console.log("合并数据:", mergedData);

        // 处理数据以适应导出格式
        const processedData = await processExcelJSDataForExport(
          mergedData,
          module.name
        );

        console.log("处理数据:", processedData);

        // 创建工作表
        const worksheet = workbook.addWorksheet(module.sheetName, {
          properties: {
            tabColor: { argb: "FF4F81BD" }
          }
        });

        // 使用 ExcelJS 创建美化的工作表
        await createExcelJSWorksheet(
          worksheet,
          processedData,
          module.sheetName
        );

        console.log(`模块 ${module.sheetName} 处理完成`);
      } catch (error) {
        console.error(`处理模块 ${module.sheetName} 失败:`, error);
        ElMessage.warning(`模块 ${module.sheetName} 导出失败，已跳过`);
      }
    }

    // 4. 生成并下载 Excel 文件
    if (workbook.worksheets.length === 0) {
      ElMessage.error("没有可导出的数据");
      return;
    }

    // 生成 Excel 文件的 buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const fileName = `ESG_报告_${year}.xlsx`;

    saveAs(blob, fileName);
    ElMessage.success("ESG 报告导出成功");
  } catch (error) {
    console.error("导出 ESG 数据失败:", error);
    ElMessage.error("导出失败，请重试");
  }
}

/**
 * 处理数据以适应 ExcelJS 导出格式（优化附件显示）
 * @param data 原始数据
 * @param moduleName 模块名称
 * @returns 处理后的数据
 */
async function processExcelJSDataForExport(
  data: any,
  moduleName: string
): Promise<any[]> {
  const result: any[] = [];

  // 从配置中获取当前模块的配置
  const moduleConfig = EXCEL_CONFIG[moduleName];

  if (!moduleConfig) {
    console.warn(`模块 ${moduleName} 没有配置，使用通用处理方式`);
    // 通用处理方式
    Object.keys(data).forEach(key => {
      if (
        !key.toLowerCase().includes("file") &&
        !key.toLowerCase().includes("list")
      ) {
        result.push({
          title: key,
          content: data[key]?.join("\n") || ""
        });
      } else if (
        (key.toLowerCase().includes("file") ||
          key.toLowerCase().includes("list")) &&
        data[key]?.length
      ) {
        // 处理附件字段
        (async () => {
          const attachments = await convertToAbsoluteUrls(
            data[key].map((item: any) => item.response?.data)
          );
          if (attachments.length > 0) {
            result.push({
              title: `${key} - 附件`,
              content: formatAttachmentsForExcel(attachments)
            });
          }
        })();
      }
    });
    return result;
  }

  // 遍历配置中的每个字段
  for (const field of moduleConfig) {
    const { label, value, isFile } = field;

    if (isFile) {
      // 处理文件类型字段
      const fileList = data[value];
      if (fileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          fileList.map((item: any) => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: `${label} - 附件`,
            content: formatAttachmentsForExcel(attachments)
          });
        } else {
          result.push({
            title: `${label} - 附件`,
            content: ""
          });
        }
      } else {
        result.push({
          title: `${label} - 附件`,
          content: ""
        });
      }
    } else {
      // 处理普通文本字段
      result.push({
        title: label,
        content: data[value]?.join("\n") || ""
      });
    }
  }

  return result;
}
//#endregion
