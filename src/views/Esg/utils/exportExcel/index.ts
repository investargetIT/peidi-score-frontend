import { baseUrlApi, getEsgRuleDetail } from "@/api/esg";
import { ElMessage } from "element-plus";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatToken, getToken } from "@/utils/auth";

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
          mergedData[key].push(`${item.userName}: ${value}`);
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
 * 创建工作表
 * @param data 数据
 * @param sheetName 工作表名称
 * @returns 工作表
 */
function createWorksheet(data: any[], sheetName: string): any {
  // 准备表格数据：第一行是标题，后续行是数据
  const tableData = [[sheetName]]; // 标题行

  // 添加数据行
  data.forEach(item => {
    tableData.push([item.title, item.content]);
  });

  // 创建工作表
  const worksheet = XLSX.utils.aoa_to_sheet(tableData);

  // 合并标题行单元格（从 A1 到 B1）
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  // 设置列宽
  worksheet["!cols"] = [{ wch: 40 }, { wch: 100 }];

  return worksheet;
}

/**
 * 导出所有 ESG 数据到 Excel
 * @param year 年份
 */
export async function exportAllEsgData(year: string) {
  try {
    ElMessage.info(`正在加载 ${year} 年 ESG 数据...`);

    // 1. 获取所有模块数据
    const modulesDataMap = await fetchAllEsgModulesData(year);

    if (modulesDataMap.size === 0) {
      ElMessage.error("未获取到任何 ESG 数据");
      return;
    }

    // 2. 创建工作簿
    const workbook = XLSX.utils.book_new();

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
        const processedData = await processDataForExport(
          mergedData,
          module.name
        );

        console.log("处理数据:", processedData);
        // return;

        // 创建工作表
        const worksheet = createWorksheet(processedData, module.sheetName);

        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, module.sheetName);

        console.log(`模块 ${module.sheetName} 处理完成`);
      } catch (error) {
        console.error(`处理模块 ${module.sheetName} 失败:`, error);
        ElMessage.warning(`模块 ${module.sheetName} 导出失败，已跳过`);
      }
    }

    // 4. 生成并下载 Excel 文件
    if (workbook.SheetNames.length === 0) {
      ElMessage.error("没有可导出的数据");
      return;
    }

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const fileName = `ESG_报告_${year}.xlsx`;

    saveAs(blob, fileName);
    ElMessage.success("ESG 报告导出成功");
  } catch (error) {
    console.error("导出 ESG 数据失败:", error);
    ElMessage.error("导出失败，请重试");
  }
}

/**
 * 处理数据以适应导出格式
 * @param data 原始数据
 * @param moduleName 模块名称
 * @returns 处理后的数据
 */
async function processDataForExport(
  data: any,
  moduleName: string
): Promise<any[]> {
  const result: any[] = [];

  // 根据不同的模块处理数据
  switch (moduleName) {
    case "company-overview":
      result.push({
        title: "公司全称",
        content: data?.companyFullName?.join("\n") || ""
      });

      result.push({
        title: "总部所在地",
        content: data?.headquartersLocation?.join("\n") || ""
      });

      result.push({
        title: "公司组织架构图",
        content: data?.reportingEntitiesDescription?.join("\n") || ""
      });

      if (data?.reportingEntitiesFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.reportingEntitiesFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "公司组织架构图 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "公司组织架构图 - 附件",
          content: ""
        });
      }

      result.push({
        title: "说明：组织的活动、产品、服务，以及所服务的市场",
        content: data?.activitiesAndServicesDescription?.join("\n") || ""
      });

      result.push({
        title:
          "与先前报告期相比，组织的活动、产品、服务，以及所服务的市场是否有重大变化",
        content: data?.activitiesChangesDescription?.join("\n") || ""
      });

      result.push({
        title: "主要产品功能与用途",
        content: data?.productFunctionDescription?.join("\n") || ""
      });

      if (data?.activitiesAndServicesFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.activitiesAndServicesFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "活动、品牌、产品和服务 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "活动、品牌、产品和服务 - 附件",
          content: ""
        });
      }

      result.push({
        title: "生产基地所在国家",
        content: data?.productionBaseCountries?.join("\n") || ""
      });

      result.push({
        title: "提供产品和服务的国家",
        content: data?.serviceCountries?.join("\n") || ""
      });

      result.push({
        title: "提供产品和服务所在的地理位置",
        content: data?.serviceGeographicLocations?.join("\n") || ""
      });

      result.push({
        title: "服务的行业",
        content: data?.serviceIndustries?.join("\n") || ""
      });

      result.push({
        title: "客户和受益人的类型",
        content: data?.customerBeneficiaryTypes?.join("\n") || ""
      });

      result.push({
        title: "战略愿景",
        content: data?.strategicVision?.join("\n") || ""
      });

      result.push({
        title: "使命",
        content: data?.mission?.join("\n") || ""
      });

      result.push({
        title: "核心价值观",
        content: data?.coreValues?.join("\n") || ""
      });

      result.push({
        title: "发展战略",
        content: data?.developmentStrategy?.join("\n") || ""
      });

      result.push({
        title: "组织参与或支持的外界发起的经济、环境、社会章程、原则或其他倡议",
        content: data?.externalInitiativesDescription?.join("\n") || ""
      });

      result.push({
        title: "外部倡议新闻链接",
        content: data?.externalInitiativesNewsLink?.join("\n") || ""
      });

      if (data?.externalInitiativesFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.externalInitiativesFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "外部倡议 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "外部倡议 - 附件",
          content: ""
        });
      }

      result.push({
        title: "主要协会成员资格清单",
        content: data?.associationMembershipDescription?.join("\n") || ""
      });

      result.push({
        title: "协会成员资格新闻链接",
        content: data?.associationMembershipNewsLink?.join("\n") || ""
      });

      if (data?.associationMembershipFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.associationMembershipFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "协会成员资格 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "协会成员资格 - 附件",
          content: ""
        });
      }

      result.push({
        title: "公司及其子公司获得的重要荣誉奖项与颁奖单位",
        content: data?.honorsAndRecognitionDescription?.join("\n") || ""
      });

      if (data?.honorsAndRecognitionFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.honorsAndRecognitionFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "荣誉认可 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "荣誉认可 - 附件",
          content: ""
        });
      }

      result.push({
        title: "公司本年度发生的重大事件",
        content: data?.annualMajorEventsDescription?.join("\n") || ""
      });

      result.push({
        title: "公司年度重大事件新闻链接",
        content: data?.annualMajorEventsNewsLink?.join("\n") || ""
      });

      if (data?.annualMajorEventsFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.annualMajorEventsFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "公司年度重大事件 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "公司年度重大事件 - 附件",
          content: ""
        });
      }
      break;

    case "corporate-governance":
      result.push({
        title: "公司的组织架构，并说明公司最高管治机构及其委员会的构成",
        content: data?.governanceStructureDescription?.join("\n") || ""
      });

      if (data?.governanceStructureFiles?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.governanceStructureFiles.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "管治架构 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "管治架构 - 附件",
          content: ""
        });
      }

      result.push({
        title: "董事会成员数量",
        content: data?.boardMemberCount?.join("\n") || ""
      });
      result.push({
        title: "董事会专门委员会成员数量",
        content: data?.boardCommitteeMemberCount?.join("\n") || ""
      });
      result.push({
        title: "职工董事数量",
        content: data?.employeeDirectorCount?.join("\n") || ""
      });
      result.push({
        title: "职工董事占比",
        content: data?.employeeDirectorRatio?.join("\n") || ""
      });
      result.push({
        title: "监事会成员数量",
        content: data?.supervisorCount?.join("\n") || ""
      });
      result.push({
        title: "职工监事数量",
        content: data?.employeeSupervisorCount?.join("\n") || ""
      });
      result.push({
        title: "职工监事占比",
        content: data?.employeeSupervisorRatio?.join("\n") || ""
      });

      if (data?.boardCompositionFiles?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.boardCompositionFiles.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "董事会构成名单 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "董事会构成名单 - 附件",
          content: ""
        });
      }

      result.push({
        title: "董事会多元化声明",
        content: data?.boardDiversityStatement?.join("\n") || ""
      });
      result.push({
        title: "董事会成员背景",
        content: data?.boardMemberBackground?.join("\n") || ""
      });
      result.push({
        title: "女性董事数量",
        content: data?.femaleDirectorCount?.join("\n") || ""
      });
      result.push({
        title: "女性董事占比",
        content: data?.femaleDirectorRatio?.join("\n") || ""
      });

      result.push({
        title: "董事培训",
        content: data?.boardTrainingDescription?.join("\n") || ""
      });
      result.push({
        title: "董事培训次数",
        content: data?.boardTrainingCount?.join("\n") || ""
      });
      result.push({
        title: "董事培训覆盖面",
        content: data?.boardTrainingCoverage?.join("\n") || ""
      });

      if (data?.boardTrainingFiles?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.boardTrainingFiles.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "董事培训 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "董事培训 - 附件",
          content: ""
        });
      }

      result.push({
        title: "董事会独立性声明",
        content: data?.boardIndependenceStatement?.join("\n") || ""
      });
      result.push({
        title: "审计委员会独立性",
        content: data?.auditCommitteeIndependence?.join("\n") || ""
      });
      result.push({
        title: "战略与 ESG 委员会独立性",
        content: data?.esgCommitteeIndependence?.join("\n") || ""
      });
      result.push({
        title: "薪酬与提名委员会独立性",
        content: data?.remunerationCommitteeIndependence?.join("\n") || ""
      });
      result.push({
        title: "独立董事数量",
        content: data?.independentDirectorCount?.join("\n") || ""
      });
      result.push({
        title: "独立董事占比",
        content: data?.independentDirectorRatio?.join("\n") || ""
      });
      result.push({
        title: "非执行董事数量",
        content: data?.nonExecutiveDirectorCount?.join("\n") || ""
      });
      result.push({
        title: "非执行董事占比",
        content: data?.nonExecutiveDirectorRatio?.join("\n") || ""
      });
      result.push({
        title: "独立非执行董事数量",
        content: data?.independentNonExecutiveDirectorCount?.join("\n") || ""
      });
      result.push({
        title: "独立非执行董事占比",
        content: data?.independentNonExecutiveDirectorRatio?.join("\n") || ""
      });

      result.push({
        title: "董事会与委员会的提名与遴选",
        content: data?.boardNominationSelection?.join("\n") || ""
      });

      result.push({
        title: "股东大会职责",
        content: data?.shareholderMeetingDuties?.join("\n") || ""
      });
      result.push({
        title: "董事会职责",
        content: data?.boardMeetingDuties?.join("\n") || ""
      });
      result.push({
        title: "董事会专门委员会职责",
        content: data?.boardCommitteeDuties?.join("\n") || ""
      });
      result.push({
        title: "监事会职责",
        content: data?.supervisorMeetingDuties?.join("\n") || ""
      });
      result.push({
        title: "股东大会召开次数",
        content: data?.shareholderMeetingCount?.join("\n") || ""
      });
      result.push({
        title: "股东大会审议通过项数",
        content: data?.shareholderMeetingResolutionCount?.join("\n") || ""
      });
      result.push({
        title: "董事会召开次数",
        content: data?.boardMeetingCount?.join("\n") || ""
      });
      result.push({
        title: "董事会审议通过项数",
        content: data?.boardMeetingResolutionCount?.join("\n") || ""
      });
      result.push({
        title: "董事会专门委员会召开次数",
        content: data?.boardCommitteeMeetingCount?.join("\n") || ""
      });
      result.push({
        title: "董事会专门委员会审议通过项数",
        content: data?.boardCommitteeMeetingResolutionCount?.join("\n") || ""
      });
      result.push({
        title: "监事会召开次数",
        content: data?.supervisorMeetingCount?.join("\n") || ""
      });
      result.push({
        title: "监事会审议通过项数",
        content: data?.supervisorMeetingResolutionCount?.join("\n") || ""
      });

      result.push({
        title: "高管薪酬政策",
        content: data?.executiveCompensationPolicy?.join("\n") || ""
      });
      result.push({
        title: "高管薪酬与 ESG 表现挂钩",
        content: data?.executiveCompensationEsgLink?.join("\n") || ""
      });

      result.push({
        title: "信息披露遵循的理念或原则",
        content: data?.disclosurePrinciple?.join("\n") || ""
      });
      result.push({
        title: "信息披露遵循的法律法规及规范性文件",
        content: data?.disclosureRegulation?.join("\n") || ""
      });
      result.push({
        title: "定期报告发布数",
        content: data?.regularReportCount?.join("\n") || ""
      });
      result.push({
        title: "临时报告发布数",
        content: data?.interimReportCount?.join("\n") || ""
      });

      result.push({
        title: "投资者沟通渠道",
        content: data?.investorCommunicationChannels?.join("\n") || ""
      });
      result.push({
        title: "投资者沟通活动类型",
        content: data?.investorCommunicationTypes?.join("\n") || ""
      });
      result.push({
        title: "收到的投资者问询总数",
        content: data?.investorInquiryCount?.join("\n") || ""
      });
      result.push({
        title: "年度领导重要讲话稿",
        content: data?.annualSpeech?.join("\n") || ""
      });
      result.push({
        title: "投资者问询答复率",
        content: data?.investorReplyRate?.join("\n") || ""
      });
      result.push({
        title: "各类型投资者沟通活动举办次数",
        content: data?.investorActivityCount?.join("\n") || ""
      });
      result.push({
        title: "各类型投资者沟通活动覆盖人次",
        content: data?.investorActivityCoverage?.join("\n") || ""
      });

      result.push({
        title: "投资者教育活动与宣传",
        content: data?.investorEducationPromotion?.join("\n") || ""
      });
      result.push({
        title: "投资者保护举措",
        content: data?.investorProtectionMeasures?.join("\n") || ""
      });
      result.push({
        title: "中小股东保护",
        content: data?.minorityShareholderProtection?.join("\n") || ""
      });

      if (data?.investorInteractionFiles?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.investorInteractionFiles.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "投资者互动 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "投资者互动 - 附件",
          content: ""
        });
      }

      if (data?.investorInteractionCaseFiles?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.investorInteractionCaseFiles.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "投资者交流活动案例 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "投资者交流活动案例 - 附件",
          content: ""
        });
      }

      if (data?.investorEducationFiles?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.investorEducationFiles.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "投资者教育 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "投资者教育 - 附件",
          content: ""
        });
      }

      result.push({
        title: "内控和风险管理理念或管理方针",
        content: data?.riskManagementPhilosophy?.join("\n") || ""
      });
      result.push({
        title: "内控和风险管理战略或总体目标",
        content: data?.riskManagementStrategy?.join("\n") || ""
      });
      result.push({
        title: "内控管理组织架构及职责",
        content: data?.managementStructureDuties?.join("\n") || ""
      });
      result.push({
        title: "内控管理核心制度",
        content: data?.managementCorePolicies?.join("\n") || ""
      });
      result.push({
        title: "内控管理流程",
        content: data?.managementProcess?.join("\n") || ""
      });
      result.push({
        title: "风险识别",
        content: data?.riskIdentification?.join("\n") || ""
      });
      result.push({
        title: "风险应对措施",
        content: data?.riskResponseMeasures?.join("\n") || ""
      });

      result.push({
        title: "商业道德理念或管理方针以及总体目标",
        content: data?.businessEthicsGoals?.join("\n") || ""
      });

      result.push({
        title: "平等对待中小企业",
        content: data?.smeFairTreatment?.join("\n") || ""
      });

      result.push({
        title: "反腐廉洁组织架构及职责",
        content: data?.antiCorruptionStructureDuties?.join("\n") || ""
      });
      result.push({
        title: "反腐廉洁政策",
        content: data?.antiCorruptionPolicy?.join("\n") || ""
      });
      result.push({
        title: "腐败风险评估",
        content: data?.corruptionRiskAssessment?.join("\n") || ""
      });
      result.push({
        title: "反腐败举报制度",
        content: data?.antiCorruptionReportingSystem?.join("\n") || ""
      });
      result.push({
        title: "反腐败举报渠道",
        content: data?.antiCorruptionReportingChannels?.join("\n") || ""
      });
      result.push({
        title: "举报人保护政策",
        content: data?.whistleblowerProtectionPolicy?.join("\n") || ""
      });
      result.push({
        title: "廉洁承诺书覆盖面",
        content: data?.integrityCommitmentCoverage?.join("\n") || ""
      });
      result.push({
        title: "对商业伙伴反贪污，贿赂的监管",
        content: data?.partnerAntiCorruptionSupervision?.join("\n") || ""
      });
      result.push({
        title: "廉洁文化宣传渠道与措施",
        content: data?.integrityCulturePromotion?.join("\n") || ""
      });
      result.push({
        title: "反腐败反贿赂发生事件",
        content: data?.antiCorruptionIncidents?.join("\n") || ""
      });
      result.push({
        title: "廉洁承诺书签署率",
        content: data?.integrityCommitmentSigningRate?.join("\n") || ""
      });
      result.push({
        title: "反腐败、反贿赂培训人次",
        content: data?.antiCorruptionTrainingParticipants?.join("\n") || ""
      });
      result.push({
        title: "反腐败、反贿赂培训总时长",
        content: data?.antiCorruptionTrainingTotalHours?.join("\n") || ""
      });
      result.push({
        title: "反腐败、反贿赂培训人均时长",
        content: data?.antiCorruptionTrainingAvgHours?.join("\n") || ""
      });

      if (data?.antiCorruptionFiles?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.antiCorruptionFiles.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "反腐败 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "反腐败 - 附件",
          content: ""
        });
      }

      result.push({
        title: "反垄断与公平竞争管理体系与制度",
        content: data?.antiMonopolySystem?.join("\n") || ""
      });
      result.push({
        title: "反垄断与公平竞争风险控制",
        content: data?.antiMonopolyRiskControl?.join("\n") || ""
      });
      result.push({
        title: "反垄断与不当竞争诉讼、行政处罚",
        content: data?.antiMonopolyLitigation?.join("\n") || ""
      });
      result.push({
        title: "反垄断与公平竞争培训场次",
        content: data?.antiMonopolyTrainingSessions?.join("\n") || ""
      });
      result.push({
        title: "反垄断与公平竞争培训人次",
        content: data?.antiMonopolyTrainingParticipants?.join("\n") || ""
      });
      result.push({
        title: "反垄断与公平竞争培训总时长",
        content: data?.antiMonopolyTrainingTotalHours?.join("\n") || ""
      });
      result.push({
        title: "反垄断与公平竞争培训人均时长",
        content: data?.antiMonopolyTrainingAvgHours?.join("\n") || ""
      });

      if (data?.antiMonopolyTrainingFiles?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.antiMonopolyTrainingFiles.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "反垄断培训 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "反垄断培训 - 附件",
          content: ""
        });
      }

      result.push({
        title: "针对违规违纪事件的处理制度",
        content: data?.violationHandlingSystem?.join("\n") || ""
      });
      result.push({
        title: "违规违纪事件类型",
        content: data?.violationTypes?.join("\n") || ""
      });
      result.push({
        title: "违规违纪事件发生次数",
        content: data?.violationCount?.join("\n") || ""
      });
      result.push({
        title: "违规违纪事件处理率",
        content: data?.violationHandlingRate?.join("\n") || ""
      });

      result.push({
        title:
          "治理重大事件（包括股本架构改变、兼并重组、投资并购、制度修订等）",
        content: data?.governanceMajorEvents?.join("\n") || ""
      });

      result.push({
        title: "公司治理类的荣誉认可、被纳入的指数",
        content: data?.honorsRecognition?.join("\n") || ""
      });
      break;

    case "esg-management":
      result.push({
        title: "公司全称",
        content: data?.companyFullName?.join("\n") || ""
      });
      result.push({
        title: "纳入组织可持续发展报告的实体",
        content: data?.reportingEntitiesDescription?.join("\n") || ""
      });
      result.push({
        title: "ESG 目标制定与审核",
        content: data?.targetSetAndReview?.join("\n") || ""
      });
      result.push({
        title: "管理战略与方针",
        content: data?.managementStrategyAndPolicy?.join("\n") || ""
      });
      result.push({
        title: "提供产品和服务所在的地理位置",
        content: data?.serviceGeographicLocations?.join("\n") || ""
      });
      result.push({
        title: "战略愿景",
        content: data?.strategicVision?.join("\n") || ""
      });
      result.push({
        title: "外部倡议",
        content: data?.externalInitiativesDescription?.join("\n") || ""
      });
      result.push({
        title: "协会成员资格",
        content: data?.associationMembershipDescription?.join("\n") || ""
      });
      result.push({
        title: "荣誉认可",
        content: data?.honorsAndRecognitionDescription?.join("\n") || ""
      });
      break;

    case "business-operations":
      result.push({
        title: "直接经济效益",
        content: data?.directEconomicBenefit?.join("\n") || ""
      });
      result.push({
        title: "政府给予的财政补贴",
        content: data?.governmentSubsidy?.join("\n") || ""
      });
      result.push({
        title: "战略与政策",
        content: data?.strategyPolicy?.join("\n") || ""
      });
      result.push({
        title: "目标达成情况",
        content: data?.goalAchievement?.join("\n") || ""
      });
      result.push({
        title: "组织架构",
        content: data?.organizationStructure?.join("\n") || ""
      });
      result.push({
        title: "政策制度",
        content: data?.policySystem?.join("\n") || ""
      });
      result.push({
        title: "研究平台",
        content: data?.researchPlatform?.join("\n") || ""
      });
      result.push({
        title: "科学伦理",
        content: data?.scientificEthics?.join("\n") || ""
      });
      result.push({
        title: "重大创新成果",
        content: data?.majorInnovationAchievements?.join("\n") || ""
      });
      result.push({
        title: "科技荣誉",
        content: data?.scienceTechHonors?.join("\n") || ""
      });
      result.push({
        title: "研发投入",
        content: data?.rndInvestment?.join("\n") || ""
      });
      result.push({
        title: "创新认证",
        content: data?.innovationCertification?.join("\n") || ""
      });
      result.push({
        title: "创新影响",
        content: data?.innovationImpact?.join("\n") || ""
      });
      result.push({
        title: "可持续设计",
        content: data?.sustainableDesign?.join("\n") || ""
      });
      result.push({
        title: "合作机制",
        content: data?.cooperationMechanism?.join("\n") || ""
      });
      result.push({
        title: "标准制定",
        content: data?.standardsEstablishment?.join("\n") || ""
      });
      result.push({
        title: "行业活动",
        content: data?.industryActivities?.join("\n") || ""
      });
      result.push({
        title: "管理体系",
        content: data?.managementSystem?.join("\n") || ""
      });
      result.push({
        title: "知识产权组织架构",
        content: data?.intellectualPropertyOrgStructure?.join("\n") || ""
      });
      result.push({
        title: "知识产权法律",
        content: data?.intellectualPropertyLaws?.join("\n") || ""
      });
      result.push({
        title: "知识产权政策",
        content: data?.intellectualPropertyPolicies?.join("\n") || ""
      });
      result.push({
        title: "知识产权保护",
        content: data?.intellectualPropertyProtection?.join("\n") || ""
      });
      result.push({
        title: "专利总数",
        content: data?.patentTotalCount?.join("\n") || ""
      });
      result.push({
        title: "新型专利数量",
        content: data?.patentNewTypeCount?.join("\n") || ""
      });
      result.push({
        title: "宣传培训",
        content: data?.publicityTraining?.join("\n") || ""
      });
      result.push({
        title: "知识产权培训场次",
        content: data?.iprTrainingSessions?.join("\n") || ""
      });
      result.push({
        title: "知识产权培训人次",
        content: data?.iprTrainingParticipants?.join("\n") || ""
      });
      result.push({
        title: "知识产权培训总时长",
        content: data?.iprTrainingTotalHours?.join("\n") || ""
      });
      result.push({
        title: "知识产权培训人均时长",
        content: data?.iprTrainingAvgHours?.join("\n") || ""
      });

      if (data?.honorsAndRecognitionFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.honorsAndRecognitionFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "荣誉认可 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "荣誉认可 - 附件",
          content: ""
        });
      }

      if (data?.industryActivitiesFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.industryActivitiesFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "行业活动 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "行业活动 - 附件",
          content: ""
        });
      }

      if (data?.publicityTrainingFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.publicityTrainingFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "宣传培训 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "宣传培训 - 附件",
          content: ""
        });
      }
      break;

    case "quality-food-safety":
      result.push({
        title: "政策承诺",
        content: data?.policyCommitment?.join("\n") || ""
      });
      result.push({
        title: "目标完成情况",
        content: data?.goalCompletionStatus?.join("\n") || ""
      });
      result.push({
        title: "组织架构",
        content: data?.organizationStructure?.join("\n") || ""
      });
      result.push({
        title: "政策与法规",
        content: data?.policyAndRegulation?.join("\n") || ""
      });
      result.push({
        title: "全周期质量管理",
        content: data?.lifecycleQualityManagement?.join("\n") || ""
      });
      result.push({
        title: "认证与审验",
        content: data?.certificationAndAudit?.join("\n") || ""
      });
      result.push({
        title: "宣贯与培训",
        content: data?.trainingAndPromotion?.join("\n") || ""
      });
      result.push({
        title: "质量提升行动",
        content: data?.qualityImprovementActions?.join("\n") || ""
      });
      result.push({
        title: "荣誉及奖项",
        content: data?.honorsAndAwards?.join("\n") || ""
      });
      result.push({
        title: "重大事故",
        content: data?.majorIncidents?.join("\n") || ""
      });
      result.push({
        title: "健康与安全",
        content: data?.healthAndSafety?.join("\n") || ""
      });
      result.push({
        title: "动物福利政策",
        content: data?.animalWelfarePolicy?.join("\n") || ""
      });
      result.push({
        title: "安全管理制度体系",
        content: data?.safetyManagementPolicies?.join("\n") || ""
      });
      result.push({
        title: "安全管理组织架构",
        content: data?.safetyManagementOrg?.join("\n") || ""
      });
      result.push({
        title: "安全培训",
        content: data?.safetyTraining?.join("\n") || ""
      });
      result.push({
        title: "安全风险识别与检查",
        content: data?.riskIdentification?.join("\n") || ""
      });
      result.push({
        title: "应急事件管理",
        content: data?.emergencyManagement?.join("\n") || ""
      });
      result.push({
        title: "装备安全管理",
        content: data?.equipmentSafetyManagement?.join("\n") || ""
      });
      result.push({
        title: "危害风险评估",
        content: data?.hazardRiskAssessment?.join("\n") || ""
      });
      result.push({
        title: "产品组成",
        content: data?.productComposition?.join("\n") || ""
      });
      result.push({
        title: "产品处置及环境影响",
        content: data?.productDisposalImpact?.join("\n") || ""
      });
      result.push({
        title: "产品信息标识违规事件",
        content: data?.productLabelViolation?.join("\n") || ""
      });
      result.push({
        title: "市场营销",
        content: data?.marketing?.join("\n") || ""
      });
      result.push({
        title: "产品可及性",
        content: data?.productAccessibility?.join("\n") || ""
      });
      result.push({
        title: "客户投诉",
        content: data?.customerComplaints?.join("\n") || ""
      });
      result.push({
        title: "客户满意度",
        content: data?.customerSatisfaction?.join("\n") || ""
      });
      result.push({
        title: "产品召回程序",
        content: data?.productRecallProcedure?.join("\n") || ""
      });
      result.push({
        title: "产品召回数量",
        content: data?.productRecallCount?.join("\n") || ""
      });

      if (data?.qualityPracticeFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.qualityPracticeFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "质量管理实践 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "质量管理实践 - 附件",
          content: ""
        });
      }

      if (data?.honorsAndAwardsFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.honorsAndAwardsFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "荣誉及奖项 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "荣誉及奖项 - 附件",
          content: ""
        });
      }

      if (data?.safetyTrainingFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.safetyTrainingFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "安全培训 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "安全培训 - 附件",
          content: ""
        });
      }

      if (data?.certificationAndAuditFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.certificationAndAuditFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "认证与审验 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "认证与审验 - 附件",
          content: ""
        });
      }

      if (data?.trainingAndPromotionFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.trainingAndPromotionFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "宣贯与培训 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "宣贯与培训 - 附件",
          content: ""
        });
      }

      if (data?.emergencyManagementFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.emergencyManagementFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "应急事件管理 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "应急事件管理 - 附件",
          content: ""
        });
      }
      break;

    case "supplier-management":
      result.push({
        title: "政策承诺",
        content: data?.policyCommitment?.join("\n") || ""
      });
      result.push({
        title: "目标完成情况",
        content: data?.goalCompletionStatus?.join("\n") || ""
      });
      result.push({
        title: "组织架构",
        content: data?.organizationStructure?.join("\n") || ""
      });
      result.push({
        title: "政策与制度",
        content: data?.policyAndRegulation?.join("\n") || ""
      });
      result.push({
        title: "风险管理",
        content: data?.riskManagement?.join("\n") || ""
      });
      result.push({
        title: "数字化管理平台",
        content: data?.digitalManagementPlatform?.join("\n") || ""
      });
      result.push({
        title: "供应商 ESG 培训体系",
        content: data?.esgTrainingSystem?.join("\n") || ""
      });
      result.push({
        title: "开展供应商 ESG 培训次数",
        content: data?.esgTrainingCount?.join("\n") || ""
      });
      result.push({
        title: "供应商参与 ESG 培训百分比",
        content: data?.esgTrainingParticipationRate?.join("\n") || ""
      });
      result.push({
        title: "公司内部通过可持续采购培训的采购员比例",
        content: data?.sustainableProcurementRate?.join("\n") || ""
      });
      result.push({
        title: "供应商 ESG 审查与评估",
        content: data?.esgReviewAssessment?.join("\n") || ""
      });
      result.push({
        title: "签署供应商行为准则",
        content: data?.codeOfConductSigning?.join("\n") || ""
      });
      result.push({
        title: "签订包含环境和劳工要求条款的供应商百分比",
        content: data?.envLaborClauseSupplierRate?.join("\n") || ""
      });
      result.push({
        title: "开展了社会影响评估的供应商数量",
        content: data?.socialImpactAssessmentSupplierCount?.join("\n") || ""
      });
      result.push({
        title: "开展了环境影响评估的供应商数量",
        content: data?.environmentalImpactSupplierCount?.join("\n") || ""
      });
      result.push({
        title: "经确定为具有实际和潜在重大负面社会影响的供应商数量",
        content: data?.negativeSocialImpactSupplierCount?.join("\n") || ""
      });
      result.push({
        title: "经确定为具有实际和潜在重大负面环境影响的供应商数量",
        content:
          data?.negativeEnvironmentalImpactSupplierCount?.join("\n") || ""
      });
      result.push({
        title: "供应商认证及审核",
        content: data?.supplierCertificationCount?.join("\n") || ""
      });
      result.push({
        title: "供应商认证及审核率",
        content: data?.supplierCertificationRate?.join("\n") || ""
      });
      result.push({
        title: "供应商总数",
        content: data?.supplierTotalCount?.join("\n") || ""
      });
      result.push({
        title: "向当地供应商采购比例",
        content: data?.localSupplierPurchaseRate?.join("\n") || ""
      });
      result.push({
        title: "新增供应商数量",
        content: data?.newSupplierCount?.join("\n") || ""
      });
      result.push({
        title: "使用社会标准筛选的新供应商百分比",
        content: data?.socialStandardNewSupplierRate?.join("\n") || ""
      });
      result.push({
        title: "公平交易",
        content: data?.fairTrade?.join("\n") || ""
      });
      result.push({
        title: "能力建设支持",
        content: data?.capacityBuildingSupport?.join("\n") || ""
      });

      if (data?.trainingAttachmentFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.trainingAttachmentFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "供应商培训 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "供应商培训 - 附件",
          content: ""
        });
      }

      if (data?.rightsAttachmentFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.rightsAttachmentFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "供应商权益保护 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "供应商权益保护 - 附件",
          content: ""
        });
      }
      break;

    case "information-security-privacy":
      result.push({
        title: "信息与隐私安全保护组织架构",
        content: data?.infoPrivacyOrgStructure?.join("\n") || ""
      });
      result.push({
        title: "信息与隐私安全保护制度体系",
        content: data?.infoPrivacyPolicySystem?.join("\n") || ""
      });
      result.push({
        title: "信息安全相关事件",
        content: data?.infoSecurityIncidents?.join("\n") || ""
      });
      result.push({
        title: "信息与隐私安全保护防范与应对措施",
        content: data?.infoPrivacyProtectionMeasures?.join("\n") || ""
      });
      result.push({
        title: "资金投入",
        content: data?.infoPrivacyInvestment?.join("\n") || ""
      });
      result.push({
        title: "泄漏事件",
        content: data?.privacyLeakIncidents?.join("\n") || ""
      });
      result.push({
        title: "内部数字化建设",
        content: data?.internalDigitalConstruction?.join("\n") || ""
      });
      result.push({
        title: "信息安全与隐私保护意识培训场次",
        content: data?.infoPrivacyTrainingDescription?.join("\n") || ""
      });
      result.push({
        title: "信息安全与隐私保护意识培训场次（数值）",
        content: data?.infoPrivacyTrainingSessions?.join("\n") || ""
      });
      result.push({
        title: "信息安全与隐私保护意识培训人次",
        content: data?.infoPrivacyTrainingParticipants?.join("\n") || ""
      });
      result.push({
        title: "信息安全与隐私保护意识培训总时长",
        content: data?.infoPrivacyTrainingTotalHours?.join("\n") || ""
      });
      result.push({
        title: "信息安全与隐私保护意识培训人均时长",
        content: data?.infoPrivacyTrainingAvgHours?.join("\n") || ""
      });

      if (data?.publicityTrainingAttachmentFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.publicityTrainingAttachmentFileList.map(
            item => item.response?.data
          )
        );
        if (attachments.length > 0) {
          result.push({
            title: "信息安全培训 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "信息安全培训 - 附件",
          content: ""
        });
      }
      break;

    case "employees":
      result.push({
        title: "正式员工数量",
        content: data?.permanentEmployeeCount?.join("\n") || ""
      });
      result.push({
        title: "临时员工数量",
        content: data?.temporaryEmployeeCount?.join("\n") || ""
      });
      result.push({
        title: "全职员工数量",
        content: data?.fullTimeEmployeeCount?.join("\n") || ""
      });
      result.push({
        title: "兼职员工数量",
        content: data?.partTimeEmployeeCount?.join("\n") || ""
      });
      result.push({
        title: "公平就业政策",
        content: data?.fairEmploymentPolicy?.join("\n") || ""
      });
      result.push({
        title: "员工手册说明",
        content: data?.employeeHandbookDescription?.join("\n") || ""
      });
      result.push({
        title: "员工薪资社保",
        content: data?.employeeSalarySocialSecurity?.join("\n") || ""
      });
      result.push({
        title: "薪酬激励政策",
        content: data?.compensationIncentivePolicy?.join("\n") || ""
      });
      result.push({
        title: "福利关怀政策",
        content: data?.welfareCarePolicy?.join("\n") || ""
      });
      result.push({
        title: "人才发展理念",
        content: data?.talentDevelopmentConcept?.join("\n") || ""
      });
      result.push({
        title: "员工沟通政策",
        content: data?.employeeCommunicationPolicy?.join("\n") || ""
      });
      result.push({
        title: "员工满意度调查",
        content: data?.employeeSatisfactionSurvey?.join("\n") || ""
      });

      if (data?.honorCertificateAttachments?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.honorCertificateAttachments.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "荣誉证书 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "荣誉证书 - 附件",
          content: ""
        });
      }

      if (data?.employeeHandbookAttachments?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.employeeHandbookAttachments.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "员工手册 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "员工手册 - 附件",
          content: ""
        });
      }

      if (data?.talentDevelopmentAttachments?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.talentDevelopmentAttachments.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "人才发展 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "人才发展 - 附件",
          content: ""
        });
      }

      if (data?.welfareCareAttachments?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.welfareCareAttachments.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "福利关怀 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "福利关怀 - 附件",
          content: ""
        });
      }
      break;

    case "environmental-impact":
      result.push({
        title: "政策承诺",
        content: data?.policyCommitment?.join("\n") || ""
      });
      result.push({
        title: "目标完成情况",
        content: data?.goalCompletionStatus?.join("\n") || ""
      });
      result.push({
        title: "组织架构",
        content: data?.organizationStructure?.join("\n") || ""
      });
      result.push({
        title: "政策与制度",
        content: data?.policyAndRegulation?.join("\n") || ""
      });
      result.push({
        title: "气候风险管理",
        content: data?.climateRiskManagement?.join("\n") || ""
      });
      result.push({
        title: "温室气体排放总量",
        content: data?.totalGhgEmissions?.join("\n") || ""
      });
      result.push({
        title: "环保投入资金",
        content: data?.envInvestmentAmount?.join("\n") || ""
      });
      result.push({
        title: "能源消耗",
        content: data?.electricityConsumption?.join("\n") || ""
      });
      result.push({
        title: "水资源管理",
        content: data?.waterIntake?.join("\n") || ""
      });
      result.push({
        title: "废弃物管理",
        content: data?.nonHazardousWasteTotal?.join("\n") || ""
      });
      result.push({
        title: "生物多样性政策",
        content: data?.biodiversityPolicy?.join("\n") || ""
      });

      if (data?.envHonorsAttachmentFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.envHonorsAttachmentFileList.map(item => item.response?.data)
        );
        if (attachments.length > 0) {
          result.push({
            title: "环境荣誉 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "环境荣誉 - 附件",
          content: ""
        });
      }

      if (data?.ghgVerificationAttachmentFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.ghgVerificationAttachmentFileList.map(
            item => item.response?.data
          )
        );
        if (attachments.length > 0) {
          result.push({
            title: "温室气体核查 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "温室气体核查 - 附件",
          content: ""
        });
      }
      break;

    case "community-welfare":
      result.push({
        title: "社会公益投入金额",
        content: data?.socialWelfareInvestment?.join("\n") || ""
      });
      result.push({
        title: "社区公益战略与目标",
        content: data?.communityWelfareStrategy?.join("\n") || ""
      });
      result.push({
        title: "打造品牌公益项目",
        content: data?.brandCharityProjects?.join("\n") || ""
      });
      result.push({
        title: "社区公益与志愿活动实践",
        content: data?.communityVolunteerActivities?.join("\n") || ""
      });
      result.push({
        title: "员工参与公益志愿活动总人数",
        content: data?.volunteerTotalParticipants?.join("\n") || ""
      });
      result.push({
        title: "乡村振兴实践",
        content: data?.ruralRevitalizationPractice?.join("\n") || ""
      });
      result.push({
        title: "乡村振兴总投入",
        content: data?.ruralRevitalizationInvestment?.join("\n") || ""
      });

      if (data?.brandCharityProjectsAttachmentFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.brandCharityProjectsAttachmentFileList.map(
            item => item.response?.data
          )
        );
        if (attachments.length > 0) {
          result.push({
            title: "品牌公益项目 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "品牌公益项目 - 附件",
          content: ""
        });
      }

      if (data?.ruralRevitalizationAttachmentFileList?.length) {
        const attachments = await convertToAbsoluteUrls(
          data.ruralRevitalizationAttachmentFileList.map(
            item => item.response?.data
          )
        );
        if (attachments.length > 0) {
          result.push({
            title: "乡村振兴 - 附件",
            content: attachments.join("\n") || ""
          });
        }
      } else {
        result.push({
          title: "乡村振兴 - 附件",
          content: ""
        });
      }
      break;

    default:
      // 其他模块的通用处理
      Object.keys(data).forEach(key => {
        if (
          !key.toLowerCase().includes("file") &&
          !key.toLowerCase().includes("list")
        ) {
          result.push({
            title: key,
            content: data[key] || ""
          });
        }
      });
  }

  return result;
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
