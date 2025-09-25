// 简单的认证工具函数

// 检查用户是否已登录
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// 获取存储的token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// 登出函数
export const logout = (): void => {
  localStorage.removeItem('token');
};

// 获取用户信息（从token解析）
export const getUserInfo = (): { username: string } | null => {
  const token = getToken();
  if (!token) return null;

  try {
    // 解码JWT token获取用户信息
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      username: payload.username
    };
  } catch (error) {
    console.error('解析token失败:', error);
    return null;
  }
};