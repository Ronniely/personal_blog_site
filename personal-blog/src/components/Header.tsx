import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* 移动端菜单按钮 */}
          <button 
            className="menu-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* 网站标志 */}
          <div className="logo">
            <Link to="/">
              <h1>黄文杰个人博客</h1>
            </Link>
          </div>

          {/* 桌面端导航菜单 */}
          <nav className="nav-desktop">
            <ul className="nav-list">
              <li><Link to="/">首页</Link></li>
              <li><Link to="/categories">分类</Link></li>
              <li><Link to="/tags">标签</Link></li>
              <li><Link to="/about">关于</Link></li>
              <li><Link to="/contact">联系</Link></li>
            </ul>
          </nav>

          {/* 搜索框 */}
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
      </div>
    </header>
  );
};

export default Header;