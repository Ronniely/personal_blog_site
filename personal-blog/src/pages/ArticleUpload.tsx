import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate } from 'react-router-dom';

const ArticleUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!title.trim() || !markdown.trim()) {
      alert('请输入标题和内容');
      return;
    }

    // 这里使用localStorage临时存储，实际项目中应该替换为API调用
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const newArticle = {
      id: Date.now().toString(),
      title,
      content: markdown,
      createdAt: new Date().toISOString()
    };

    articles.push(newArticle);
    localStorage.setItem('articles', JSON.stringify(articles));
    navigate('/');
  };

  return (
    <div className="article-upload-container">
      <h1>发布新文章</h1>
      <div className="input-group">
        <label htmlFor="title">标题:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入文章标题"
        />
      </div>
      <div className="editor-container">
        <MDEditor
          value={markdown}
          onChange={(val) => setMarkdown(val || '')}
          height={400}
          // MDEditor 组件不支持 placeholder 属性，移除该属性
        />
      </div>
      <button className="submit-btn" onClick={handleSubmit}>发布文章</button>

      <style>{`
        .article-upload-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .input-group {
          margin-bottom: 20px;
        }
        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .input-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        .editor-container {
          margin-bottom: 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        .submit-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .submit-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ArticleUpload;