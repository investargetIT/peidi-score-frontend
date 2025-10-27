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

// 判断是否有权限编辑模块
export const hasEditPermission = (moduleName: string) => {
  const moduleList = {
    "company-overview": "companyOverview",
    "esg-management": "esgManagement",
    "corporate-governance": "corporateGovernance",
    "business-operations": "businessOperations",
    "quality-food-safety": "qualityFoodSafety",
    "supplier-management": "supplierManagement",
    "information-security-privacy": "informationSecurityPrivacy",
    employees: "employees",
    "environmental-impact": "environmentalImpact",
    "community-welfare": "communityWelfare"
  };

  const esgEnum = JSON.parse(localStorage.getItem("esgEnum") || "[]");
  const curDDUserInfo = JSON.parse(localStorage.getItem("esgUserInfo") || "{}");

  return esgEnum.some(
    item =>
      item.value.includes(curDDUserInfo?.userid) &&
      item.value.includes(moduleList[moduleName])
  );
};
