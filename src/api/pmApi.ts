import { http } from "@/utils/http";

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

const baseOmsUrlApi = (url: string) => {
  return `https://api.peidigroup.cn/oms${url}`;
};

const baseUrlApi = (url: string, hasUi = true) => {
  return `https://api.peidigroup.cn/${hasUi ? "ui" : ""}${url}`;
};

// 开发环境下的接口地址
const baseUrlApiDev = (url: string, hasUi = true) => {
  return baseUrlApi(url, hasUi);
  // return `http://12.18.1.12:8090/${hasUi ? "ui" : ""}${url}`;
};

const commonUrlApi = (url: string) => `${"https://user.peidigroup.cn"}${url}`;

// 获取业务单元

export const omsGetShops = params => {
  return http.request("get", baseOmsUrlApi("/orders/shopTarget"), {
    params
  });
};

// 新建任务
export const newTask = data => {
  return http.request("post", baseUrlApi("/traceability-flow/new"), {
    data
  });
};

// 获取产品列表
export const getProductList = params => {
  return http.request("get", baseUrlApi("/traceability-flow/page"), {
    params
  });
};

// 删除产品
export const deleteProduct = data => {
  return http.request("post", baseUrlApi("/traceability-flow/delete"), {
    data
  });
};

// 更新产品
export const updateProduct = data => {
  return http.request("post", baseUrlApi("/traceability-flow/update"), {
    data
  });
};

// 新增中检测信息
export const newMiddleCheck = data => {
  return http.request("post", baseUrlApi("/traceability-Info/new"), {
    data
  });
};

// 更新中检测信息
export const updateMiddleCheck = data => {
  return http.request("post", baseUrlApi("/traceability-Info/update"), {
    data
  });
};

// 获取中检测信息
export const getMiddleCheck = params => {
  return http.request("get", baseUrlApi("/traceability-Info/page"), {
    params
  });
};

// 删除中检测信息
export const deleteMiddleCheck = data => {
  return http.request("post", baseUrlApi("/traceability-Info/delete"), {
    data
  });
};

// 获取是否有待分配的任务
export const getTaskUnassigned = params => {
  return http.request("get", baseUrlApi("/task-manage/hasExamine"), {
    params
  });
};

// 下载文件
export const downloadFile = params => {
  return http.request("get", baseUrlApi("prm/common/download", false), {
    params
  });
};

export const fetchStatusList = () => {
  return http.request("get", baseUrlApi("prm/common/enum", false), {
    params: {
      type: "status"
    }
  });
};

export const getFileDownLoadPath = params => {
  return http.request("get", baseUrlApi("/common/download-url"), {
    params
  });
};

// 更新用户信息
export const updateUserInfo = data => {
  return http.request("post", baseUrlApiDev("ui/user/info", false), {
    data
  });
};

// 获取用户信息
export const getUserInfoData = params => {
  return http.request("get", baseUrlApi("ui/user/info", false), {
    params
  });
};

// 用户离职
export const deleteUser = data => {
  return http.request("post", baseUrlApi("ui/user/delete", false), {
    data: JSON.stringify(data)
  });
};

// 获取积分历史信息
export const getScoreHistoryList = params => {
  if (process.env.NODE_ENV === "development") {
    return http.request("get", baseUrlApiDev("/point/record/page"), {
      params
    });
  }
  return http.request("get", baseUrlApi("/point/record/page"), {
    params
  });
};

// 积分回滚
export const rollbackScoreHistory = data => {
  if (process.env.NODE_ENV === "development") {
    return http.request("post", baseUrlApiDev("/point/record/callback"), {
      data
    });
  }
  return http.request("post", baseUrlApi("/point/record/callback"), {
    data
  });
};

// 获取枚举信息
export const getEnumTypeList = params => {
  return http.request("get", baseUrlApi("/common/enum"), {
    params
  });
};

// 获取积分排行榜信息
export const getScoreRankList = params => {
  if (process.env.NODE_ENV === "development") {
    return http.request("get", baseUrlApiDev("/user/page"), {
      params
    });
  }
  return http.request("get", baseUrlApi("/user/page"), {
    params
  });
};

// 获取用户信息
export const getUserList = params => {
  if (process.env.NODE_ENV === "development") {
    return http.request("get", baseUrlApiDev("/user/page"), {
      params
    });
  }
  return http.request("get", baseUrlApi("/user/page"), {
    params
  });
};

// 调整用户积分
export const updateUseScore = data => {
  if (process.env.NODE_ENV === "development") {
    return http.request("post", baseUrlApiDev("ui/point/point", false), {
      data
    });
  }
  return http.request("post", baseUrlApi("ui/point/point", false), {
    data
  });
};

// 获取配置规则列表
export const getPointRuleList = params => {
  return http.request("get", baseUrlApi("/point/rule/page"), {
    params
  });
};

// 新增积分活动
export const addScoreAction = data => {
  return http.request("post", baseUrlApi("/point/rule/new"), {
    data
  });
};

export interface getExchangeListItem {
  dataSource: number;
  category: string;
  id: number;
  imageUrl: string;
  pointsChange: number;
  ruleId: number;
  title: string;
}
// 获取兑换列表
export const getExchangeList = () => {
  return http.request("get", baseUrlApiDev("/point/redeem/list"), {
    timeout: 60e3
  });
};

// 获取兑换记录分页
export const getRecordPage = (params: {
  pageNo: number;
  pageSize: number;
  searchStr?: string;
  sortStr?: string;
}) => {
  return http.request("get", baseUrlApiDev("/point/record/page"), {
    params
  });
};

// 记录修改
export const updateRecord = (data: any) => {
  return http.request("post", baseUrlApiDev("/point/record/update"), {
    data
  });
};

// ============ 月度经费：接口待定，以下是临时实现 ============
// TODO: 真实接口待定，接入后替换下面的函数体
// 期望返回：每个用户 1-12 月经费是否已使用，前端收到后转成 { userId: boolean[12] }
// 示例后端返回格式: [{ userId, monthsUsed: [true, false, ...12项] }]
export const getMonthlyFundUsage = async (
  userIds: string[]
): Promise<Record<string, boolean[]>> => {
  // ===== 临时演示数据（仅用于界面预览，真实接口接入后删除）=====
  // 根据 userId 生成稳定的伪随机 1-12 月使用情况
  const result: Record<string, boolean[]> = {};
  userIds.forEach(userId => {
    const seed = parseInt(String(userId || "0").slice(-4), 10) || 0;
    result[userId] = Array.from(
      { length: 12 },
      (_, i) => (seed * (i + 3)) % 7 < 3
    );
  });
  return result;

  // ===== 真实接口示例（待接口文档确认后启用）=====
  // const res = await http.request("get", baseUrlApiDev("/point/month-fund"), {
  //   params: { userIds: userIds.join(",") }
  // });
  // const map: Record<string, boolean[]> = {};
  // if (res?.data) {
  //   (res.data as { userId: string; monthsUsed: boolean[] }[]).forEach(
  //     item => (map[item.userId] = item.monthsUsed)
  //   );
  // }
  // return map;
};
