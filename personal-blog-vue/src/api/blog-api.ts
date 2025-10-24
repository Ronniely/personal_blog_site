import request from "@/utils/request";
import type { PingReq, PingResp } from "./types";
import type { IApiResponse } from "@/types/api";

export const BlogApiAPI = {
  /** ping */
  pingApi(data?: PingReq): Promise<IApiResponse<PingResp>> {
    return request({
      url: "/blog-api/v1/ping",
      method: "GET",
      data: data,
    });
  },
};
