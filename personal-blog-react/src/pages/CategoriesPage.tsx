import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Category, BlogPost } from '../types';
import { getCategories, addCategory, deleteCategory } from '../data/categoryManager';
import './CategoriesPage.css';

// 从localStorage获取所有文章
const getBlogPostsFromLocalStorage = (): BlogPost[] => {
  try {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    return posts as BlogPost[];
  } catch (error) {
    console.error('Failed to load blog posts from localStorage:', error);
    return [];
  }
};

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [message, setMessage] = useState('');

  // 加载分类数据
  const loadCategories = () => {
    const cats = getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    // 从localStorage加载文章
    const blogPosts = getBlogPostsFromLocalStorage();
    setPosts(blogPosts);
    // 加载分类数据
    loadCategories();
  }, []);

  // 添加新分类
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const success = addCategory(newCategoryName.trim());
    if (success) {
      setMessage('分类添加成功！');
      setNewCategoryName('');
      loadCategories(); // 重新加载分类
    } else {
      setMessage('分类已存在！');
    }

    // 3秒后清除消息
    setTimeout(() => setMessage(''), 3000);
  };

  // 删除分类
  const handleDeleteCategory = (id: string) => {
    const success = deleteCategory(id);
    if (success) {
      setMessage('分类删除成功！');
      loadCategories(); // 重新加载分类
    } else {
      setMessage('删除失败，请重试！');
    }

    // 3秒后清除消息
    setTimeout(() => setMessage(''), 3000);
  };

  // 根据分类名称获取文章数量 - 现在从分类对象直接获取
  const getPostsCountByCategory = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return posts.filter(post => post.category === category?.name).length;
  };

  // 添加分类管理样式
  const style = `
    .add-category-form-container {
      margin-bottom: 30px;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .section-title {
      margin-top: 0;
      margin-bottom: 15px;
      color: #333;
    }

    .add-category-form {
      display: flex;
      gap: 10px;
    }

    .category-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .add-category-button {
      padding: 8px 16px;
      background-color: #4a6fa5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .add-category-button:hover {
      background-color: #3a5a8c;
    }

    .category-message {
      margin-top: 10px;
      padding: 8px;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      background-color: #e8f4fd;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .delete-category-button {
      background: none;
      border: none;
      color: #ff4d4d;
      cursor: pointer;
      padding: 4px;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .delete-category-button:hover {
      opacity: 1;
    }
  `;

  // 注入样式
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <Layout>
      <div className="categories-page">
        <h2 className="page-title">文章分类</h2>

        {/* 添加分类表单 */}
        <div className="add-category-form-container">
          <h3 className="section-title">添加新分类</h3>
          <form onSubmit={handleAddCategory} className="add-category-form">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="输入分类名称"
              className="category-input"
              required
            />
            <button type="submit" className="add-category-button">添加</button>
          </form>
          {message && <p className="category-message">{message}</p>}
        </div>

        {/* 分类列表 */}
        <div className="categories-list">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <Link to={`/category/${category.id}`} className="category-link">
                  <h3 className="category-name">{category.name}</h3>
                </Link>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="delete-category-button"
                  aria-label={`删除分类 ${category.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
              <div className="category-stats">
                <span className="category-count">{getPostsCountByCategory(category.name)} 篇文章</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;