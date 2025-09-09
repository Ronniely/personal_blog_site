import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { BlogPost, Tag } from '../types';
import './TagsPage.css';

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

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // 从localStorage加载文章
    const blogPosts = getBlogPostsFromLocalStorage();
    setPosts(blogPosts);

    // 提取所有唯一标签
    const allTags: string[] = [];
    blogPosts.forEach((post: BlogPost) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => allTags.push(tag));
      }
    });

    // 计算每个标签的文章数量
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 转换为标签数组
    const uniqueTags = Object.keys(tagCounts).map((tagName, index) => ({
      id: index.toString(),
      name: tagName,
      count: tagCounts[tagName]
    }));

    setTags(uniqueTags);
  }, []);

  return (
    <Layout>
      <div className="tags-page">
        <h2 className="page-title">文章标签</h2>

        {/* 标签云 */}
        <div className="tags-cloud">
          {tags.map(tag => (
            <Link 
              key={tag.id} 
              to={`/tag/${tag.id}`} 
              className="tag-link"
              style={{
                fontSize: `${14 + ((tag.count || 0) * 1.5)}px`,
                opacity: 0.5 + ((tag.count || 0) * 0.1)
              }}
            >
              <span className="tag-name">{tag.name}</span>
              <span className="tag-count">({tag.count})</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TagsPage;