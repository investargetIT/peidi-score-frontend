// 1. 在<script setup>中添加正整数校验方法
export const onlyPositiveInteger = value => {
  const v = String(value).replace(/\D/g, "");
  return v.replace(/^0+/, "") || "";
};

// 新增正数（大于0的小数）校验方法
export const onlyPositiveNumber = value => {
  let v = String(value).replace(/[^\d.]/g, "");
  // 只保留第一个小数点
  v = v.replace(/\.(?=.*\.)/g, "");
  // 去除前导0
  v = v.replace(/^0+(?=\d)/, "");
  // 去除开头小数点
  v = v.replace(/^\./, "");
  if (!v) return v;
  // 限制最大值为100
  if (parseFloat(v) > 100) v = "100";
  return v;
};

const moduleList: Record<string, string> = {
  "company-overview": "companyOverview", // 公司概览权限标识
  "corporate-governance": "corporateGovernance", // 公司治理权限标识
  "esg-management": "esgManagement", // ESG管理权限标识
  "business-operations": "businessOperations", // 产业发展与运营权限标识
  "quality-food-safety": "qualityFoodSafety", // 质量与食品安全权限标识
  "supplier-management": "supplierManagement", // 供应链管理权限标识
  "information-security-privacy": "informationSecurityPrivacy", // 信息安全与隐私保护权限标识
  employees: "employees", // 员工权限标识
  "environmental-impact": "environmentalImpact", // 环境影响权限标识
  "community-welfare": "communityWelfare" // 回馈社会权限标识
};

// 判断是否有权限编辑模块
export const hasEditPermission = (moduleName: string) => {
  // 开发环境下，默认所有模块都有编辑权限
  if (process.env.NODE_ENV === "development") {
    return true;
    // 调试用
    if (moduleName === "esg-management") return true;
    return false;
  }

  const esgEnum = JSON.parse(localStorage.getItem("esgEnum") || "[]");
  const curDDUserInfo = JSON.parse(localStorage.getItem("esgUserInfo") || "{}");

  // 在esgEnum里找到含有curDDUserInfo?.userid的项
  const userItem = esgEnum.find((item: any) =>
    item.value.includes(curDDUserInfo?.userid)
  );

  // 如果没有找到则返回false
  if (!userItem) return false;

  // // 特殊处理：如果含有所有模块，则不让修改
  // if (userItem.value.split("&").length === Object.keys(moduleList).length + 1) {
  //   return false;
  // }

  // 如果找到则判断是否包含moduleList[moduleName]
  return userItem.value.includes(moduleList[moduleName]);

  // return esgEnum.some(
  //   item =>
  //     item.value.includes(curDDUserInfo?.userid) &&
  //     item.value.includes(moduleList[moduleName])
  // );
};

/**
 * 判断是否可以编辑
 * 管理员需要查看和编辑两种模式
 * 1. 管理员需要查看和编辑两种模式，查看模式下不能编辑
 * 2. 普通用户只能查看，不能编辑
 * @param moduleName 模块名称
 * @param modeVal 模式值，false表示查看模式，true表示编辑模式
 * @returns 是否可以编辑
 */
export const canEditModule = (moduleName: string, modeVal: boolean) => {
  const hasPermission = hasEditPermission(moduleName);
  if (!hasPermission) return false;
  // 编辑模式下，返回true
  if (modeVal) return true;
  // 查看模式下，返回false
  return false;
};
