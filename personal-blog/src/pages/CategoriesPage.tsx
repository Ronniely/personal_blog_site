import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { categories, getBlogPostsByCategory } from '../data/mockData';
import './CategoriesPage.css';

const CategoriesPage: React.FC = () => {
  return (
    <Layout>
      <div className="categories-page">
        <h2 className="page-title">文章分类</h2>
        
        {/* 分类列表 */}
        <div className="categories-list">
          {categories.map(category => {
            const posts = getBlogPostsByCategory(category.name);
            return (
              <div key={category.id} className="category-card">
                <Link to={`/category/${category.id}`} className="category-link">
                  <h3 className="category-name">{category.name}</h3>
                  <div className="category-stats">
                    <span className="category-count">{posts.length} 篇文章</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;