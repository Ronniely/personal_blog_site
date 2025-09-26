// API服务封装

const BASE_URL = 'http://localhost:3000/api';

// 请求配置接口
interface RequestOptions {
  method?: string;
  headers?: HeadersInit;
  body?: string;
}

// 基础请求函数
const request = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  // 获取token（如果存在）
  const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!).token : null;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);
    
    if (!response.ok) {
      // 如果是401未授权错误，清除本地存储并跳转到登录页
      if (response.status === 401) {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
      }
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
};

// 文章相关API
export const articleAPI = {
  // 获取文章列表
  getArticles: (page = 1, limit = 10) => {
    return request<{ code: number; data: any[]; msg: string }>(`/articles?page=${page}&limit=${limit}`);
  },

  // 获取文章详情
  getArticleDetail: (id: string) => {
    return request<{ code: number; data: any; msg: string }>(`/article?id=${id}`);
  },

  // 创建文章
  createArticle: (article: any) => {
    return request<{ code: number; data: any; msg: string }>(`/article`, {
      method: 'POST',
      body: JSON.stringify(article),
    });
  },

  // 更新文章
  updateArticle: (article: any) => {
    return request<{ code: number; data: any; msg: string }>(`/article`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  },

  // 删除文章
  deleteArticle: (id: string) => {
    return request<{ code: number; data: null; msg: string }>(`/article?id=${id}`, {
      method: 'DELETE',
    });
  },

  // 根据分类获取文章
  getArticlesByCategory: (categoryId: string, page = 1, limit = 10) => {
    return request<{ code: number; data: any[]; msg: string }>(`/articles/category?categoryId=${categoryId}&page=${page}&limit=${limit}`);
  },

  // 根据标签获取文章
  getArticlesByTag: (tagId: string, page = 1, limit = 10) => {
    return request<{ code: number; data: any[]; msg: string }>(`/articles/tag?tagId=${tagId}&page=${page}&limit=${limit}`);
  },

  // 创建评论
  createComment: (articleId: string, content: string) => {
    return request<{ code: number; data: any; msg: string }>(`/comment`, {
      method: 'POST',
      body: JSON.stringify({ articleId, content }),
    });
  },
};

// 分类相关API
export const categoryAPI = {
  // 获取分类列表
  getCategories: () => {
    return request<{ code: number; data: any[]; msg: string }>(`/categories`);
  },
};

// 标签相关API
export const tagAPI = {
  // 获取标签列表
  getTags: () => {
    return request<{ code: number; data: any[]; msg: string }>(`/tags`);
  },
};

// 用户相关API
export const userAPI = {
  // 登录
  login: (username: string, password: string) => {
    return request<{ code: number; data: { token: string }; msg: string }>(`/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // 注册
  register: (username: string, password: string, email: string) => {
    return request<{ code: number; data: any; msg: string }>(`/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
  },
};

// 健康检查API
export const healthAPI = {
  checkHealth: () => {
    return request<{ code: number; data: any; msg: string }>(`/health`);
  },
};