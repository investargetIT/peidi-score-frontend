import { http } from "@/utils/http";

// 调试接口地址
const debugBaseUrl = "http://12.18.1.36:8090";

export const debugBaseUrlApi = (url: string, hasUi = true) => {
  return `${debugBaseUrl}/${hasUi ? "ui" : ""}${url}`;
};

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
  return http.request("get", debugBaseUrlApi("/esg/config"), {
    params
  });
};

// 创建ESG配置
export const createEsgConfig = (data: CreateEsgConfigRequest) => {
  return http.request("post", debugBaseUrlApi("/esg/config"), {
    data
  });
};
