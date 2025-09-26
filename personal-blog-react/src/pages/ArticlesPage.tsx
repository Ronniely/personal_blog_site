import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import dayjs from 'dayjs';
import './ArticlesPage.css';

// 定义文章类型接口
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

const ArticlesPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 从localStorage加载所有文章
  useEffect(() => {
    try {
      const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      // 按创建时间降序排序
      storedPosts.sort((a: Post, b: Post) => 
        dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
      );
      setPosts(storedPosts);
    } catch (error) {
      console.error('Failed to load articles:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 删除文章
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      const updatedPosts = posts.filter(post => post.id !== id);
      setPosts(updatedPosts);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      // 删除相关评论
      localStorage.removeItem(`comments_${id}`);
      alert('文章已成功删除');
    }
  };

  // 编辑文章 - 跳转到编辑页面（假设存在编辑页面）
  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="articles-page">
          <div className="page-header">
            <h1>所有文章</h1>
            <Link to="/upload" className="btn-new-article">发布新文章</Link>
          </div>
          <div className="loading">加载中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="articles-page">
        <div className="page-header">
          <h1>所有文章</h1>
          <Link to="/upload" className="btn-new-article">发布新文章</Link>
        </div>

        {posts.length === 0 ? (
          <div className="no-articles">
            <p>暂无文章</p>
            <Link to="/upload" className="btn-new-article">发布第一篇文章</Link>
          </div>
        ) : (
          <div className="articles-table">
            <table>
              <thead>
                <tr>
                  <th>标题</th>
                  <th>分类</th>
                  <th>发布日期</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="article-row">
                    <td className="article-title">
                      <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </td>
                    <td className="article-category">
                      <Link to={`/categories/${post.category}`}>{post.category}</Link>
                    </td>
                    <td className="article-date">
                      {dayjs(post.createdAt).format('YYYY-MM-DD')}
                    </td>
                    <td className="article-status">
                      <span className="status-published">已发布</span>
                    </td>
                    <td className="article-actions">
                      <button
                        onClick={() => handleEdit(post.id)}
                        className="btn-edit"
                        title="编辑"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="btn-delete"
                        title="删除"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ArticlesPage;