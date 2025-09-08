import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostById } from '../data/mockData';
import { BlogPost, Comment } from '../types';
import Layout from '../components/Layout';
import dayjs from 'dayjs';
import markdownIt from 'markdown-it';
import './PostDetailPage.css';

// 初始化markdown-it实例
const md = markdownIt({
  html: true,
  xhtmlOut: false,
  breaks: true,
  langPrefix: 'language-',
  linkify: true,
  typographer: true,
  highlight: function(str: string, lang: string) {
    // 这里可以添加代码高亮逻辑，目前简单返回带语言类的代码块
    if (lang && lang.length > 0) {
      return `<pre class="language-${lang}"><code class="language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
    }
    return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');

  // 加载博客文章
  useEffect(() => {
    if (id) {
      const postData = getBlogPostById(id);
      if (postData) {
        setPost(postData);
        // 模拟加载评论数据
        setComments([
          {
            id: '1',
            postId: id,
            author: '读者A',
            content: '这篇文章写得真好，学到了很多东西！',
            createdAt: '2024-01-15',
            avatar: 'https://via.placeholder.com/50?text=A'
          },
          {
            id: '2',
            postId: id,
            author: '读者B',
            content: '感谢分享，期待更多优质内容！',
            createdAt: '2024-01-16',
            avatar: 'https://via.placeholder.com/50?text=B'
          }
        ]);
      }
      setLoading(false);
    }
  }, [id]);

  // 处理评论提交
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && commentName.trim()) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        postId: id || '',
        author: commentName,
        content: newComment,
        createdAt: dayjs().format('YYYY-MM-DD'),
        avatar: commentEmail ? `https://via.placeholder.com/50?text=${commentName.charAt(0)}` : undefined
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
      setCommentName('');
      setCommentEmail('');
    }
  };

  // 渲染Markdown内容
  const renderMarkdown = (content: string) => {
    return {
      __html: md.render(content)
    };
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">加载中...</div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="error">文章不存在或已被删除</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="post-detail-page">
        {/* 文章头部信息 */}
        <div className="post-header">
          <div className="post-category">
            <Link to={`/category/${post.category}`}>
              {post.category}
            </Link>
          </div>
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta">
            <div className="post-author">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="author-avatar"
              />
              <div className="author-info">
                <span className="author-name">{post.author.name}</span>
                <div className="post-date">
                  发布于 {dayjs(post.createdAt).format('YYYY年MM月DD日')}
                  {post.updatedAt !== post.createdAt && (
                    <span className="updated-date">
                      ，更新于 {dayjs(post.updatedAt).format('YYYY年MM月DD日')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 文章封面图 */}
        {post.coverImage && (
          <div className="post-cover">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="cover-image"
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className="post-content">
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={renderMarkdown(post.content)}
          />
        </div>

        {/* 文章标签 */}
        <div className="post-tags">
          {post.tags.map((tag, index) => (
            <Link key={index} to={`/tag/${tag}`} className="tag-link">
              #{tag}
            </Link>
          ))}
        </div>

        {/* 文章操作 */}
        <div className="post-actions">
          <button className="action-button like-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>喜欢</span>
            <span className="action-count">{post.likes}</span>
          </button>
          
          <button className="action-button share-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>分享</span>
          </button>
          
          <button className="action-button bookmark-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>收藏</span>
          </button>
        </div>

        {/* 作者信息卡片 */}
        <div className="author-card">
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className="author-card-avatar"
          />
          <div className="author-card-info">
            <h3 className="author-card-name">{post.author.name}</h3>
            <p className="author-card-bio">{post.author.bio}</p>
            <div className="author-card-social">
              {post.author.socialLinks?.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                  {link.platform === 'GitHub' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  )}
                  {link.platform === 'Twitter' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  )}
                  {link.platform === 'LinkedIn' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 相关文章 */}
        <div className="related-posts">
          <h3 className="section-title">相关文章</h3>
          <div className="related-posts-grid">
            {/* 这里可以根据标签或分类显示相关文章 */}
            {/* 暂时显示最新的3篇文章 */}
            {post.id !== '1' && (
              <div className="related-post-card">
                <Link to="/post/1">
                  <div className="related-post-image">
                    <img src="https://via.placeholder.com/400x200?text=React+18" alt="React 18 新特性全面解析" />
                  </div>
                  <h4 className="related-post-title">React 18 新特性全面解析</h4>
                </Link>
              </div>
            )}
            {post.id !== '2' && (
              <div className="related-post-card">
                <Link to="/post/2">
                  <div className="related-post-image">
                    <img src="https://via.placeholder.com/400x200?text=TypeScript" alt="TypeScript 高级类型系统详解" />
                  </div>
                  <h4 className="related-post-title">TypeScript 高级类型系统详解</h4>
                </Link>
              </div>
            )}
            {post.id !== '3' && (
              <div className="related-post-card">
                <Link to="/post/3">
                  <div className="related-post-image">
                    <img src="https://via.placeholder.com/400x200?text=Performance" alt="前端性能优化实战指南" />
                  </div>
                  <h4 className="related-post-title">前端性能优化实战指南</h4>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 评论区 */}
        <div className="comments-section">
          <h3 className="section-title">评论 ({comments.length})</h3>
          
          {/* 评论列表 */}
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <img 
                  src={comment.avatar || 'https://via.placeholder.com/50?text=?'} 
                  alt={comment.author} 
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-date">{dayjs(comment.createdAt).format('YYYY年MM月DD日')}</span>
                  </div>
                  <div className="comment-text">{comment.content}</div>
                  <div className="comment-actions">
                    <button className="comment-action">回复</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 发表评论表单 */}
          <div className="comment-form-container">
            <h4 className="comment-form-title">发表评论</h4>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <div className="comment-form-group">
                <label htmlFor="comment-name">昵称 *</label>
                <input
                  type="text"
                  id="comment-name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="请输入您的昵称"
                  required
                />
              </div>
              <div className="comment-form-group">
                <label htmlFor="comment-email">邮箱 (选填)</label>
                <input
                  type="email"
                  id="comment-email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="请输入您的邮箱"
                />
              </div>
              <div className="comment-form-group">
                <label htmlFor="comment-content">评论内容 *</label>
                <textarea
                  id="comment-content"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="请输入您的评论内容..."
                  rows={5}
                  required
                />
              </div>
              <div className="comment-form-actions">
                <button type="submit" className="submit-comment-button">
                  发表评论
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetailPage;