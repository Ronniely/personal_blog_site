import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebar = true }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="layout">
      {/* 头部组件 */}
      <Header toggleMenu={toggleMenu} />
      
      {/* 移动端菜单 */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}
           onClick={() => setMenuOpen(false)}>
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
          <Sidebar />
        </div>
      </div>

      {/* 主要内容区域 */}
      <main className="main-content">
        <div className="container">
          <div className="content-wrapper">
            {/* 侧边栏（桌面端） */}
            {sidebar && <aside className="sidebar-desktop"><Sidebar /></aside>}
            
            {/* 内容 */}
            <div className="content">{children}</div>
          </div>
        </div>
      </main>

      {/* 页脚组件 */}
      <Footer />
    </div>
  );
};

export default Layout;