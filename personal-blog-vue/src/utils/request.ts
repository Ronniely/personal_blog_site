import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import MD5 from "crypto-js/md5";
import { useUserStore } from "@/store";
import { getTerminalId, getToken, getUid } from "./token";

const HeaderAppName = "App-Name";
const HeaderTimestamp = "Timestamp";
const HeaderXTerminalId = "X-Terminal-Id";
const HeaderXTerminalTsToken = "X-Terminal-Token";

const HeaderUid = "Uid";
const HeaderToken = "Token";
const HeaderAuthorization = "Authorization";

const requests = axios.create({
  baseURL: "",
  timeout: 10000,
  withCredentials: false, // 禁用 Cookie
  // 请求头
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 请求拦截器
requests.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 请求携带用户token
    const token = getToken();
    const uid = getUid();

    // 请求携带游客token
    const terminalId = getTerminalId() || "";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const xtoken = MD5(terminalId + timestamp).toString();

    config.headers = Object.assign({}, config.headers, {
      [HeaderAppName]: "blog-web",
      [HeaderTimestamp]: timestamp,
      [HeaderXTerminalId]: terminalId,
      [HeaderXTerminalTsToken]: xtoken,
      [HeaderUid]: uid,
      [HeaderToken]: token,
    });
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 配置响应拦截器
requests.interceptors.response.use(
  (response: AxiosResponse) => {
    // 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
    if (response.config.responseType === "blob" || response.config.responseType === "arraybuffer") {
      return response;
    }

    // 检查响应数据格式
    if (!response.data || typeof response.data !== 'object') {
      const errorMsg = "服务器响应格式错误";
      if (window.$message) {
        window.$message.error(errorMsg);
      } else {
        console.error(errorMsg);
      }
      return Promise.reject(new Error(errorMsg));
    }
    
    // 尝试从响应中提取code, data和message
    const code = response.data.code;
    const data = response.data.data;
    // 支持msg或message字段
    const msg = response.data.msg || response.data.message || "未知错误";
    
    // 如果没有code字段，可能是直接返回了数据
    if (code === undefined) {
      return response.data;
    }

    // 接口错误码
    switch (code) {
      case 200:
        return response.data;
      case 401:
        if (window.$message) {
          window.$message.error("用户未登录");
        } else {
          console.error("用户未登录");
        }
        return Promise.reject(new Error(msg || "用户未登录"));
      case 402:
        const userStore = useUserStore();
        userStore.forceLogOut();
        if (window.$message) {
          window.$message.error(msg);
        } else {
          console.error(msg);
        }
        return Promise.reject(new Error(msg || "凭证失效"));
      case 403:
        if (window.$message) {
          window.$message.error(msg);
        } else {
          console.error(msg);
        }
        return Promise.reject(new Error(msg || "权限不足"));
      case 500:
        if (window.$message) {
          window.$message.error(msg);
        } else {
          console.error(msg);
        }
        return Promise.reject(new Error(msg || "服务器内部错误"));
      default:
        const errorMsg = msg || `系统错误: ${code}`;
        if (window.$message) {
          window.$message.error(errorMsg);
        } else {
          console.error(errorMsg);
        }
        return Promise.reject(new Error(errorMsg));
    }
  },
  (error: AxiosError) => {
    console.error("request error", error); // for debug
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      const statusCode = message.substring(message.length - 3);
      message = `系统接口${statusCode}异常`;
    } else if (!message) {
      message = "未知错误";
    }
    if (window.$message) {
      window.$message.error(message, { duration: 5000 });
    } else {
      console.error(message);
    }
    return Promise.reject(new Error(message));
  }
);

// 对外暴露
export default requests;
