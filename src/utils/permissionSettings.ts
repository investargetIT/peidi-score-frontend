// 权限设置相关的工具函数

// 开发人员 id
const DEV_USER_IDS = [
  // 沈皓钰
  "1926449443739600965",
  // 王家琦
  "1887377779519434753",
  // 张思宇
  "1850741012504838145",
  // Summer
  "1846392647319093250"
];

/**
 * 权限配置对象
 * 每个模块对应一个权限ID数组
 */
export const permissionSettings = {
  // 积分兑换
  redeem: [
    ...DEV_USER_IDS,
    // 陈振标
    "1926449443739598857",
    // 黄琳艳 Selina
    "1926449443739598850",
    // 徐小洁
    "1874737276248436737",
    // 刘奇
    "1874006041985331202",
    // 周霖红
    "1926449443739598909",
    // 廖丽萍 Lucy
    "1869688287188811777"
  ]
};

/**
 * 检查用户是否拥有指定模块的权限
 * @param userId 用户ID
 * @param module 模块名称
 * @returns 是否拥有权限
 */
export function hasPermission(userId: string, module: string): boolean {
  const modulePermissions =
    permissionSettings[module as keyof typeof permissionSettings];
  if (!modulePermissions) {
    return false;
  }
  return modulePermissions.includes(userId);
}
