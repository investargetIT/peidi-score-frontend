import { http } from "@/utils/http";

// 环境切换：true-开发环境，false-生产环境
const isDev = false;

// 调试接口地址
const debugBaseUrl = "http://12.18.1.36:8090";

const debugBaseUrlApi = (url: string, hasUi = true) => {
  return `${debugBaseUrl}/${hasUi ? "ui" : ""}${url}`;
};

// 生产环境接口地址
const prodBaseUrlApi = (url: string, hasUi = true) => {
  return `https://api.peidigroup.cn/${hasUi ? "ui" : ""}${url}`;
};

// 根据环境选择接口
export const baseUrlApi = isDev ? debugBaseUrlApi : prodBaseUrlApi;

/**
 * ESG配置信息表
 */
export interface UiEsgConfig {
  config?: string;
  createdAt?: string;
  id?: number;
  isDel?: number;
  updatedAt?: string;
  year?: number;
  [property: string]: any;
}

/**
 * OrderItem
 */
export interface OrderItem {
  asc?: boolean;
  column?: string;
  [property: string]: any;
}

/**
 * 分页查询ESG配置请求参数
 */
export interface GetEsgConfigListRequest {
  pageNo: number;
  pageSize: number;
  year?: number;
  [property: string]: any;
}

/**
 * 分页查询ESG配置响应
 */
export interface GetEsgConfigListResponse {
  asc?: string[];
  ascs?: string[];
  countId?: string;
  current?: number;
  desc?: string[];
  descs?: string[];
  hitCount?: boolean;
  isSearchCount?: boolean;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: OrderItem[];
  pages?: number;
  records?: UiEsgConfig[];
  searchCount?: boolean;
  size?: number;
  total?: number;
  [property: string]: any;
}

/**
 * 创建ESG配置请求参数
 */
export interface CreateEsgConfigRequest {
  config?: string;
  createdAt?: string;
  id?: number;
  isDel?: number;
  updatedAt?: string;
  year?: number;
  [property: string]: any;
}

// 分页查询ESG配置
export const getEsgConfigList = (params: GetEsgConfigListRequest) => {
  return http.request("get", baseUrlApi("/esg/config"), {
    params
  });
};

// 创建ESG配置
export const createEsgConfig = (data: CreateEsgConfigRequest) => {
  return http.request("post", baseUrlApi("/esg/config"), {
    data
  });
};

// 更新ESG配置
export const updateEsgConfig = (data: CreateEsgConfigRequest) => {
  return http.request("post", baseUrlApi("/esg/config/update"), {
    data
  });
};
