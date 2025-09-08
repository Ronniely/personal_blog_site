import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { tags, getBlogPostsByTag } from '../data/mockData';
import './TagsPage.css';

const TagsPage: React.FC = () => {
  return (
    <Layout>
      <div className="tags-page">
        <h2 className="page-title">文章标签</h2>
        
        {/* 标签云 */}
        <div className="tags-cloud">
          {tags.map(tag => {
            const posts = getBlogPostsByTag(tag.name);
            return (
              <Link 
                key={tag.id} 
                to={`/tag/${tag.id}`} 
                className="tag-link"
                style={{
                  fontSize: `${14 + (posts.length * 1.5)}px`,
                  opacity: 0.5 + (posts.length * 0.1)
                }}
              >
                <span className="tag-name">{tag.name}</span>
                <span className="tag-count">({posts.length})</span>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default TagsPage;