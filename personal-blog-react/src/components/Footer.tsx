import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* 联系信息 */}
          <div className="footer-section contact-info">
            <h3 className="footer-title">个人博客</h3>
            <p className="footer-description">
              分享技术、生活和思考的个人博客，希望能为你带来有价值的内容。
            </p>
            <div className="footer-social">
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
              <a href="#" aria-label="RSS">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11a9 9 0 0 1 9 9"></path>
                  <path d="M4 4a16 16 0 0 1 16 16"></path>
                  <circle cx="5" cy="19" r="1"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="footer-section quick-links">
            <h3 className="footer-title">快速链接</h3>
            <ul className="footer-links">
              <li><Link to="/">首页</Link></li>
              <li><Link to="/categories">分类</Link></li>
              <li><Link to="/tags">标签</Link></li>
              <li><Link to="/about">关于我</Link></li>
              <li><Link to="/contact">联系方式</Link></li>
            </ul>
          </div>

          {/* 热门分类 */}
          <div className="footer-section popular-categories">
            <h3 className="footer-title">热门分类</h3>
            <ul className="footer-links">
              <li><Link to="/category/1">技术分享</Link></li>
              <li><Link to="/category/2">前端开发</Link></li>
              <li><Link to="/category/3">后端开发</Link></li>
              <li><Link to="/category/4">工具推荐</Link></li>
              <li><Link to="/category/5">职业成长</Link></li>
            </ul>
          </div>

          {/* 订阅区域 */}
          <div className="footer-section newsletter">
            <h3 className="footer-title">订阅更新</h3>
            <p className="footer-description">
              订阅我的博客，获取最新文章和技术动态。
            </p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="您的邮箱地址" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                订阅
              </button>
            </form>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} 个人博客. 保留所有权利.
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacy">隐私政策</Link>
            <Link to="/terms">使用条款</Link>
            <Link to="/sitemap">网站地图</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;