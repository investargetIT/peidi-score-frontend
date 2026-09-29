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

const commonUrlApi = (url: string) => `${"https://user.peidigroup.cn"}${url}`;

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
  return http.request(
    "get",
    `https://user.peidigroup.cn/ding/userInfo?code=${code}`,
    {}
  );
};
// 根据token拿到userId
export const getUserCheck = token => {
  return http.request(
    "get",
    `https://user.peidigroup.cn/user/user-check?token=${token}`,
    {}
  );
};

// 获取基地信息
export const getUserSite = () => {
  return http.request("get", `https://user.peidigroup.cn/user/site`, {});
};

// 注册
export const register = data => {
  return http.request(
    "post",
    `https://user.peidigroup.cn/user/email-register`,
    {
      data
    }
  );
};

export const registerMobile = data => {
  return http.request("post", `https://user.peidigroup.cn/user/sms-register`, {
    data
  });
};

// 修改用户密码
export const updateUserPassword = data => {
  return http.request(
    "post",
    `https://user.peidigroup.cn/user/update-password`,
    {
      data
    }
  );
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
  return http.request("get", `https://user.peidigroup.cn/user/user-check`, {
    params
  });
};

// 根据用户钉钉id获取上级部门列表
export const getParentDepartmentByUser = (params: { userId: string }) => {
  return http.request("get", "https://user.peidigroup.cn/ding/parentbyuser", {
    params
  });
};

// 获取部门详情
export const getDepartmentDetail = (params: { deptId: string }) => {
  return http.request("get", "https://user.peidigroup.cn/ding/department", {
    params
  });
};

// ============ 月度经费：团建费归属查询（按人聚合） ============
// GET /attendance/teamBuilding/expenses
// 请求参数: { year?: number }
// 响应示例: [{ userName: "string", userId: 0, filingDates: ["yyyy-MM", ...] }]
// 前端转成 { userId: boolean[12] }，下标 0~11 对应 1~12 月，true=该月经费已用
// 团建费接口：生产域 user.peidigroup.cn 路径不带 /attendance 前缀，测试环境 12.18.1.36:8080 带前缀
const teamBuildingUrlApi = (path: string) => {
  return `http://12.18.1.36:8080/attendance${path}`;
  // return `${"https://user.peidigroup.cn"}${path}`;
};

export const getMonthlyFundUsage = async (
  _userIds: string[],
  year?: number
): Promise<Record<string, boolean[]>> => {
  const targetYear = year || new Date().getFullYear();
  const res = await http.request(
    "get",
    teamBuildingUrlApi("/teamBuilding/expenses"),
    { params: { year: targetYear } }
  );
  const result: Record<string, boolean[]> = {};
  if (res?.code === 200 && Array.isArray(res?.data)) {
    (
      res.data as {
        userId?: number | string;
        userName?: string;
        filingDates?: string[];
      }[]
    ).forEach(item => {
      if (item.userId == null) return;
      const months = Array.from({ length: 12 }, () => false);
      (item.filingDates || []).forEach(dateStr => {
        const [y, m] = String(dateStr).split("-").map(Number);
        if (y === targetYear && m >= 1 && m <= 12) months[m - 1] = true;
      });
      result[String(item.userId)] = months;
    });
  }
  return result;
};
