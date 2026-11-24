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

export const baseUrlApi = (url: string) => {
  return `https://srm.peidigroup.cn${url}`;
};

// user 域接口（登录/钉钉/部门/团建经费等）：统一直连线上域名。
const userHostApi = (url: string) => `https://user.peidigroup.cn${url}`;

const commonUrlApi = (url: string) => userHostApi(url);

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>(
    "post",
    commonUrlApi("/user/login/password"),
    {
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};

// 获取jsapi的签名
export const getJsApi = params => {
  return http.request("get", commonUrlApi("/ding/jsapi"), {
    params
  });
};
// 根据code拿到个人信息
export const getUserInfo = code => {
  return http.request("get", userHostApi(`/ding/userInfo?code=${code}`), {});
};
// 根据token拿到userId
export const getUserCheck = token => {
  return http.request(
    "get",
    userHostApi(`/user/user-check?token=${token}`),
    {}
  );
};

// 获取基地信息
export const getUserSite = () => {
  return http.request("get", userHostApi(`/user/site`), {});
};

// 注册
export const register = data => {
  return http.request("post", userHostApi(`/user/email-register`), {
    data
  });
};

export const registerMobile = data => {
  return http.request("post", userHostApi(`/user/sms-register`), {
    data
  });
};

// 修改用户密码
export const updateUserPassword = data => {
  return http.request("post", userHostApi(`/user/update-password`), {
    data
  });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

// 获取所有分类
export const getAllCate = params => {
  return http.request("get", baseUrlApi("/category/all"), {
    params
  });
};

// 获取分页所有分类
export const getPageCate = params => {
  return http.request("get", baseUrlApi("/category/page"), {
    params
  });
};

// 添加新的分类
export const addCate = data => {
  return http.request("post", baseUrlApi("/category/new"), {
    data
  });
};

// 更改分类信息
export const updateCate = data => {
  return http.request("post", baseUrlApi("/category/update"), {
    data
  });
};

// 更改分类信息
export const deleteCate = data => {
  return http.request("post", baseUrlApi("/category/delete"), {
    data
  });
};

// 获取所有分类
export const getAllPd = params => {
  return http.request("get", baseUrlApi("/product/all"), {
    params
  });
};

// 获取分页所有分类
export const getPagePd = params => {
  return http.request("get", baseUrlApi("/product/page"), {
    params
  });
};

// 获取业务单元

// 获取用户dataSource字段
export const getUserDataSourceApi = params => {
  return http.request("get", userHostApi(`/user/user-check`), {
    params
  });
};

// 根据用户钉钉id获取上级部门列表
export const getParentDepartmentByUser = (params: { userId: string }) => {
  return http.request("get", userHostApi(`/ding/parentbyuser`), {
    params
  });
};

// 获取部门详情
export const getDepartmentDetail = (params: { deptId: string }) => {
  return http.request("get", userHostApi(`/ding/department`), {
    params
  });
};

// ============ 月度经费：团建费归属查询（按人聚合） ============
// GET /attendance/teamBuilding/expenses
// 请求参数: { year?: number }
// 响应示例: [{ userName: "string", userId: 0, filingDates: ["yyyy-MM", ...] }]
// 前端转成 { userId: boolean[12] }，下标 0~11 对应 1~12 月，true=该月经费已用
// 团建费接口（公开，无需登录）：线上与测试站路径均为 /attendance/teamBuilding/expenses（带前缀）。
// 环境切换：true-本地/测试环境 12.18.1.36:8080，false-线上 user.peidigroup.cn
// 注意：该接口会返回【尚未注册系统账号】的员工（目前仅有智创基地），调用方需自行与员工列表比对。
const isTeamBuildingLocal = false;
const teamBuildingUrlApi = (path: string) =>
  isTeamBuildingLocal
    ? `http://12.18.1.36:8080/attendance${path}`
    : `https://user.peidigroup.cn/attendance${path}`;

/**
 * 审批时间两种形态：
 * - 线上：扁平字符串，形如 "2026-09-02 18:46:00"
 * - 本地/测试：对象，形如 { approvalDate: "2026-06", filingDates: ["2026-01", ...] }
 */
export type TeamBuildingApprovalDate =
  | string
  | { approvalDate?: string; filingDates?: string[] };

export interface TeamBuildingExpenseItem {
  userId?: number | string;
  userName?: string;
  deptId?: number | string;
  filingDates?: string[];
  /** 每次申请的审批时间，一次申请可覆盖多个月份 */
  approvalDates?: TeamBuildingApprovalDate[];
}

/** 审批时间统一转成展示文本（兼容扁平字符串与本地对象两种形态） */
const normalizeApprovalDate = (raw: TeamBuildingApprovalDate): string => {
  if (raw == null) return "";
  if (typeof raw === "string") return raw.trim();
  return String(raw.approvalDate ?? "").trim();
};

/** 一次申请（一次审批）覆盖的批次：审批时间 + 该次申请覆盖的月份原文 */
export interface TeamBuildingBatch {
  /** 审批时间文本；本地接口只有年月（如 "2026-06"） */
  approvalDate: string;
  /** 该次申请覆盖的月份原文（形如 "2026-01"），已按年度过滤、去重升序 */
  filingDates: string[];
}

/**
 * 把接口的 approvalDates 还原成批次列表。
 * - 本地/测试：对象自带 filingDates，直接就是批次，可直接按批次拆行；
 * - 线上：只有扁平时间字符串、没有月份归属，返回空数组，调用方按「无批次」降级处理。
 */
const normalizeBatches = (
  rawList: TeamBuildingApprovalDate[] | undefined,
  year: number
): TeamBuildingBatch[] => {
  const batches: TeamBuildingBatch[] = [];
  (rawList || []).forEach(raw => {
    if (raw == null || typeof raw === "string") return; // 扁平字符串无月份归属
    const approvalDate = normalizeApprovalDate(raw);
    const filingDates = [
      ...new Set(
        (raw.filingDates || [])
          .map(dateStr => String(dateStr))
          .filter(dateStr => dateStr.startsWith(`${year}-`))
      )
    ].sort();
    if (!approvalDate && filingDates.length === 0) return;
    batches.push({ approvalDate, filingDates });
  });
  return batches.sort((a, b) => a.approvalDate.localeCompare(b.approvalDate));
};

/** 拉取团建经费原始列表（含未注册员工），months 下标 0~11 对应 1~12 月，true=该月经费已用 */
export const getTeamBuildingExpenses = async (
  year?: number
): Promise<
  {
    userId: string | null;
    userName: string;
    deptId?: string;
    months: boolean[];
    /** 该年度已申请的月份原文（形如 "2026-01"），供台账导出还原申请区间 */
    filingDates: string[];
    /** 该年度每次申请的审批时间（形如 "2026-09-02 18:46:00"），升序去重，供台账导出还原申请时间 */
    approvalDates: string[];
    /**
     * 批次明细（审批时间 → 该次申请覆盖的月份）。
     * 本地/测试接口自带月份归属，可据此按批次拆行；线上接口为空数组，调用方需降级。
     */
    batches: TeamBuildingBatch[];
  }[]
> => {
  const targetYear = year || new Date().getFullYear();
  const res = (await http.request(
    "get",
    teamBuildingUrlApi("/teamBuilding/expenses"),
    { params: { year: targetYear } }
  )) as { code?: number; data?: TeamBuildingExpenseItem[] };
  const list: {
    userId: string | null;
    userName: string;
    deptId?: string;
    months: boolean[];
    filingDates: string[];
    approvalDates: string[];
    batches: TeamBuildingBatch[];
  }[] = [];
  if (res?.code === 200 && Array.isArray(res?.data)) {
    res.data.forEach(item => {
      const months = Array.from({ length: 12 }, () => false);
      const filingDates: string[] = [];
      (item.filingDates || []).forEach(dateStr => {
        const [y, m] = String(dateStr).split("-").map(Number);
        if (y === targetYear && m >= 1 && m <= 12) {
          months[m - 1] = true;
          filingDates.push(String(dateStr));
        }
      });
      list.push({
        // userId 为 null 表示该员工尚未注册系统账号（无 userId 可关联），调用方据此识别未注册员工
        userId: item.userId != null ? String(item.userId) : null,
        userName: item.userName || "",
        deptId: item.deptId != null ? String(item.deptId) : undefined,
        months,
        filingDates,
        // 每次申请的审批时间：兼容线上字符串与本地对象两种形态，去空、去重、升序
        approvalDates: [
          ...new Set(
            (item.approvalDates || [])
              .map(normalizeApprovalDate)
              .filter(Boolean)
          )
        ].sort(),
        // 批次明细：只有本地接口（对象形态）能给出「这次审批覆盖哪几个月」
        batches: normalizeBatches(item.approvalDates, targetYear)
      });
    });
  }
  return list;
};

/** 按人聚合的月度经费使用情况（保留原接口返回形态，内部复用 getTeamBuildingExpenses） */
export const getMonthlyFundUsage = async (
  _userIds: string[],
  year?: number
): Promise<Record<string, boolean[]>> => {
  const list = await getTeamBuildingExpenses(year);
  const result: Record<string, boolean[]> = {};
  list.forEach(item => {
    // 未注册员工无 userId，跳过，避免污染 result 的 "null" 键
    if (item.userId != null) result[item.userId] = item.months;
  });
  return result;
};
