import React from 'react';
import { Link } from 'react-router-dom';
import { categories, tags, getPopularBlogPosts, getLatestBlogPosts } from '../data/mockData';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const popularPosts = getPopularBlogPosts(5);
  const latestPosts = getLatestBlogPosts(5);

  return (
    <aside className="sidebar">
      {/* 关于博主 */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">关于博主</h3>
        <div className="about-author">
          <img 
            src="https://via.placeholder.com/150" 
            alt="博主头像" 
            className="author-avatar"
          />
          <h4 className="author-name">博主名称</h4>
          <p className="author-bio">热爱技术和分享的开发者，专注于前端技术、编程思想和个人成长。</p>
          <div className="social-links">
            <a href="#" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* 搜索框（移动端） */}
      <div className="sidebar-section mobile-search">
        <div className="search-form">
          <input type="text" placeholder="搜索文章..." className="search-input" />
          <button type="submit" className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">分类</h3>
        <ul className="category-list">
          {categories.map(category => (
            <li key={category.id}>
              <Link to={`/category/${category.id}`} className="category-link">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 标签云 */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">标签</h3>
        <div className="tag-cloud">
          {tags.map(tag => (
            <Link 
              key={tag.id} 
              to={`/tag/${tag.id}`} 
              className="tag-link"
              style={{ 
                fontSize: `${Math.max(12, Math.min(18, 12 + tag.count * 0.8))}px`,
                opacity: Math.max(0.7, Math.min(1, 0.7 + tag.count * 0.05))
              }}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 热门文章 */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">热门文章</h3>
        <ul className="post-list">
          {popularPosts.map((post, index) => (
            <li key={post.id} className="post-item">
              <Link to={`/post/${post.id}`} className="post-link">
                <span className="post-number">{index + 1}</span>
                <div className="post-info">
                  <h4 className="post-title">{post.title}</h4>
                  <div className="post-meta">
                    <span className="post-views">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      {post.views}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 最新文章 */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">最新文章</h3>
        <ul className="post-list">
          {latestPosts.map(post => (
            <li key={post.id} className="post-item">
              <Link to={`/post/${post.id}`} className="post-link">
                <div className="post-info">
                  <h4 className="post-title">{post.title}</h4>
                  <div className="post-meta">
                    <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 订阅区域 */}
      <div className="sidebar-section subscribe-section">
        <h3 className="sidebar-title">订阅更新</h3>
        <p className="subscribe-description">输入您的邮箱，获取最新的博客文章更新。</p>
        <form className="subscribe-form">
          <input 
            type="email" 
            placeholder="您的邮箱地址" 
            className="subscribe-input"
            required
          />
          <button type="submit" className="subscribe-button">
            订阅
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;