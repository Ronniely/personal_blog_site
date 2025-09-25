import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登录成功，保存token到localStorage
        localStorage.setItem('token', data.token);
        // 跳转到首页
        navigate('/');
        window.location.reload(); // 刷新页面以更新状态
      } else {
        setError(data.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>用户登录</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">登录</button>
        </form>
        <div className="login-footer">
          <p>默认账户: admin / password123</p>
          <Link to="/" className="back-link">返回首页</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;