import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserInfo, logout } from './auth';
import './Header.css';

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const userInfo = getUserInfo();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 搜索逻辑可以在这里实现
    if (searchQuery.trim()) {
      console.log('搜索:', searchQuery);
      // 实际项目中可能会导航到搜索结果页
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    window.location.reload(); // 刷新页面以更新状态
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1 className="logo-text">个人博客</h1>
            </Link>
          </div>

          {/* 桌面端导航 */}
          <nav className="nav-desktop">
            <ul className="nav-list">
              <li><Link to="/">首页</Link></li>
              <li><Link to="/articles">所有文章</Link></li>
              <li><Link to="/categories">分类</Link></li>
              <li><Link to="/about">关于</Link></li>
              <li><Link to="/contact">联系</Link></li>
              <li><Link to="/upload">上传文章</Link></li>
              {isLoggedIn ? (
                <>
                  <li className="user-info">
                    欢迎, {userInfo?.username}
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-button">
                      登出
                    </button>
                  </li>
                </>
              ) : (
                <li><Link to="/login">登录</Link></li>
              )}
            </ul>
          </nav>
           
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* 移动端导航触发器 */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;