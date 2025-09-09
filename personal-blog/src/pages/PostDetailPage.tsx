import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import dayjs from 'dayjs';
import markdownIt from 'markdown-it';
import './PostDetailPage.css';

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

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  avatar?: string;
}

// 初始化markdown-it实例
const md = markdownIt({
  html: true,
  xhtmlOut: false,
  breaks: true,
  langPrefix: 'language-',
  linkify: true,
  typographer: true,
  highlight: function(str: string, lang: string): string {
    if (lang && lang.length > 0) {
      return `<pre class="language-${lang}"><code class="language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
    }
    return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  // 从localStorage加载文章数据
  useEffect(() => {
    if (!postId) return;

    try {
      const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const foundPost = storedPosts.find((p: Post) => p.id === postId);
      setPost(foundPost || null);

      // 加载评论（实际应用中可以从localStorage或API加载）
      const storedComments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
      setComments(storedComments);
    } catch (error) {
      console.error('Failed to load post data:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // 处理评论提交
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && commentName.trim() && postId) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        postId: postId,
        author: commentName,
        content: newComment,
        createdAt: dayjs().format('YYYY-MM-DD'),
        avatar: commentEmail ? `https://via.placeholder.com/50?text=${commentName.charAt(0)}` : undefined
      };

      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      // 保存评论到localStorage
      localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));

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
        <div className="error">
          <p>文章不存在或已被删除</p>
          <button onClick={handleGoBack} className="back-button">返回上一页</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="post-detail-page">
        {/* 返回按钮 */}
        <button onClick={handleGoBack} className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          返回上一页
        </button>

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
          <img src={post.author.avatar} alt={post.author.name} className="author-card-avatar" />
          <div className="author-card-info">
            <h3 className="author-card-name">{post.author.name}</h3>
            <p className="author-card-bio">分享技术文章和学习心得</p>
          </div>
        </div>

        {/* 评论区 */}
        <div className="comments-section">
          <h2 className="comments-title">评论 ({comments.length})</h2>
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
                    <span className="comment-date">{comment.createdAt}</span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 评论表单 */}
          <div className="comment-form-container">
            <h3 className="add-comment-title">添加评论</h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <div className="form-group">
                <label htmlFor="comment-name">姓名</label>
                <input
                  type="text"
                  id="comment-name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="comment-email">邮箱 (选填)</label>
                <input
                  type="email"
                  id="comment-email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="comment-text">评论内容</label>
                <textarea
                  id="comment-text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="form-control"
                  rows={4}
                ></textarea>
              </div>
              
              <button type="submit" className="submit-comment-btn">提交评论</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetailPage;