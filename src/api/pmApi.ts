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

const baseUrlApi = (url: string, hasPm = true) => {
  return `https://api.peidigroup.cn/${hasPm ? "prm" : ""}${url}`;
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
