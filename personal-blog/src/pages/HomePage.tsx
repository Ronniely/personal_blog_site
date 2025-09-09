import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import dayjs from 'dayjs';
import './HomePage.css';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    try {
      // 从localStorage获取文章数据
      const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      setPosts(storedPosts);
    } catch (error) {
      console.error('Failed to parse blog posts from localStorage:', error);
      setPosts([]);
    }
  }, []);

  // 按创建时间排序，最新的文章在前
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Layout>
      <div className="home-page">
        <h2 className="page-title">最新文章</h2>
        
        {/* 博客文章列表 */}
        <div className="blog-posts">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>暂无文章发布</p>
              <Link to="/upload" className="create-post-button">发布第一篇文章</Link>
            </div>
          ) : (
            sortedPosts.map(post => (
              <article key={post.id} className="blog-post-card">
                {/* 文章封面图 */}
                {post.coverImage && (
                  <div className="post-thumbnail">
                    <Link to={`/post/${post.id}`}>
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="post-image"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                )}
                
                {/* 文章内容 */}
                <div className={`post-content ${!post.coverImage ? 'full-width' : ''}`}>
                  {/* 文章分类 */}
                  <div className="post-category">
                    <Link to={`/category/${post.category}`}>
                      {post.category}
                    </Link>
                  </div>
                  
                  {/* 文章标题 */}
                  <h3 className="post-title">
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </h3>
                  
                  {/* 文章摘要 */}
                  <p className="post-excerpt">{post.excerpt}</p>
                  
                  {/* 文章元信息 */}
                  <div className="post-meta">
                    <div className="post-author">
                      <span className="author-name">{post.author.name}</span>
                    </div>
                    
                    <div className="post-date">
                      {dayjs(post.createdAt).format('YYYY年MM月DD日')}
                    </div>
                    
                    <div className="post-views">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      {post.views}
                    </div>
                    
                    <div className="post-likes">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      {post.likes}
                    </div>
                  </div>
                  
                  {/* 阅读更多按钮 */}
                  <div className="post-read-more">
                    <Link to={`/post/${post.id}`} className="read-more-button">
                      阅读更多
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        
        {/* 分页控件 */}
        <div className="pagination">
          <button className="pagination-button prev" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            上一页
          </button>
          
          <span className="pagination-info">
            第 1 页，共 1 页
          </span>
          
          <button className="pagination-button next" disabled>
            下一页
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;