/** 所有 api 接口的响应数据都应该准守该格式 */
export interface IApiResponse<T> {
  flag: boolean;
  code: number;
  data: T;
  msg: string;
  trace_id: string;
}

export interface PageResult<T> {
  list: T;
  page: number;
  page_size: number;
  total: number;
}

export interface PageQuery {
  page?: number;
  page_size?: number;
  sorts?: Sort[];
  conditions?: Condition[];
}

export interface Sort {
  field: string;
  order: string;
}

export interface Condition {
  field: string;
  value?: any;
  logic?: "and" | "or" | string;
  operator?: "like" | "=" | ">" | "<" | string;
}