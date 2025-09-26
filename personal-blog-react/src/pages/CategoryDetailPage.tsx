import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getBlogPostsByCategory, categories } from '../data/mockData';
import './CategoryDetailPage.css';

const CategoryDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // 查找当前分类
  const category = categories.find(cat => cat.id === categoryId);
  
  // 获取该分类下的所有文章
  const posts = getBlogPostsByCategory(category?.name || '');
  
  if (!category) {
    return (
      <Layout>
        <div className="category-detail-page">
          <h2 className="page-title">分类不存在</h2>
          <p>抱歉，您访问的分类不存在。</p>
          <Link to="/categories" className="back-link">返回分类列表</Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="category-detail-page">
        <div className="category-header">
          <h2 className="page-title">{category.name}</h2>
          <p className="category-description">{category.description}</p>
          <span className="post-count">共 {posts.length} 篇文章</span>
        </div>
        
        {/* 文章列表 */}
        <div className="posts-list">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <Link to={`/post/${post.id}`} className="post-link">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <span className="post-date">{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                    <span className="post-views">{post.views} 阅读</span>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>该分类下暂无文章</p>
            </div>
          )}
        </div>
        
        <div className="navigation">
          <Link to="/categories" className="back-link">返回分类列表</Link>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryDetailPage;