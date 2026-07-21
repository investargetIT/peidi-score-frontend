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

export const baseUrlApi = (url: string, hasUi = true) => {
  return `https://api.peidigroup.cn/${hasUi ? "ui" : ""}${url}`;
};

// 获取配置规则列表
export const getEsgRuleDetail = params => {
  return http.request("get", baseUrlApi("/esg/info"), {
    params
  });
};

// 获取用户列表（用于配置填写人下拉选择）
export const getEsgUserList = (params?: object) => {
  // 默认拉取全部数据源的用户，一次性取完做本地映射
  const searchStr = JSON.stringify([
    {
      searchName: "data_source",
      searchType: "equals",
      searchValue:
        "1&#&10&#&11&#&12&#&14&#&15&#&16&#&17&#&2&#&3&#&4&#&5&#&6&#&7&#&8&#&9"
    }
  ]);
  return http.request("get", baseUrlApi("/user/page"), {
    params: {
      pageNo: 1,
      pageSize: 10000,
      searchStr,
      ...params
    }
  });
};

// 更新esg
export const updateEsgConfig = data => {
  return http.request("post", baseUrlApi("/esg/info"), {
    data
  });
};

// 获取已保存的esg信息
export const getEsgInfo = params => {
  return http.request("get", baseUrlApi("/esg/info"), {
    params
  });
};

export const getFileDownLoadPath = params => {
  return http.request("get", baseUrlApi("/common/download-url"), {
    params
  });
};

// 上传ESG附件
export const uploadEsgFile = (formData: FormData) => {
  return http.request("post", baseUrlApi("/esg/upload"), {
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
