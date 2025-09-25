import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    // 用户未登录，重定向到登录页面
    return <Navigate to="/login" replace />;
  }

  // 用户已登录，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;