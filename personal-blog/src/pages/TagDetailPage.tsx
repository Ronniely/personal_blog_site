import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getBlogPostsByTag, tags } from '../data/mockData';
import './TagDetailPage.css';

const TagDetailPage: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>();
  
  // 查找当前标签
  const tag = tags.find(t => t.id === tagId);
  
  // 获取该标签下的所有文章
  const posts = getBlogPostsByTag(tag?.name || '');
  
  if (!tag) {
    return (
      <Layout>
        <div className="tag-detail-page">
          <h2 className="page-title">标签不存在</h2>
          <p>抱歉，您访问的标签不存在。</p>
          <Link to="/tags" className="back-link">返回标签列表</Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="tag-detail-page">
        <div className="tag-header">
          <h2 className="page-title">#{tag.name}</h2>
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
              <p>该标签下暂无文章</p>
            </div>
          )}
        </div>
        
        <div className="navigation">
          <Link to="/tags" className="back-link">返回标签列表</Link>
        </div>
      </div>
    </Layout>
  );
};

export default TagDetailPage;