import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate, useParams } from 'react-router-dom';
import { categories, tags } from '../data/mockData';
import './ArticleUpload.css';

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

const ArticleUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // 编辑模式下加载文章数据
  useEffect(() => {
    if (isEditMode) {
      try {
        const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const postToEdit = storedPosts.find((post: Post) => post.id === id);

        if (postToEdit) {
          setTitle(postToEdit.title);
          setContent(postToEdit.content);
          setExcerpt(postToEdit.excerpt);
          setCoverImage(postToEdit.coverImage || '');
          setCoverImagePreview(postToEdit.coverImage || '');

          // 查找分类ID
          const categoryObj = categories.find(cat => cat.name === postToEdit.category);
          if (categoryObj) {
            setCategory(categoryObj.id);
          }

          // 查找标签ID
          const tagIds = postToEdit.tags
            .map((tagName: string) => {
              const tagObj = tags.find(tag => tag.name === tagName);
              return tagObj ? tagObj.id : '';
            })
            .filter((id: string) => id);
          setSelectedTags(tagIds);
        } else {
          alert('文章不存在或已被删除');
          navigate('/articles');
        }
      } catch (error) {
        console.error('加载文章失败:', error);
        alert('加载文章失败，请重试');
        navigate('/articles');
      }
    }
  }, [id, isEditMode, navigate]);

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    setSelectedTags(options.map(option => option.value));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !category) {
      alert('请填写标题、内容并选择分类');
      return;
    }

    setIsSubmitting(true);

    // 获取选中的分类名称
    const selectedCategory = categories.find(cat => cat.id === category);
    const categoryName = selectedCategory ? selectedCategory.name : '';

    // 获取选中的标签名称
    const selectedTagNames = tags
      .filter(tag => selectedTags.includes(tag.id))
      .map(tag => tag.name);

    try {
      const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');

      if (isEditMode) {
        // 编辑模式 - 更新现有文章
        const updatedPosts = storedPosts.map((post: Post) => {
          if (post.id === id) {
            return {
              ...post,
              title,
              content,
              category: categoryName,
              tags: selectedTagNames,
              excerpt: excerpt || content.substring(0, 150),
              coverImage: coverImage || post.coverImage,
              updatedAt: new Date().toISOString()
            };
          }
          return post;
        });

        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
        alert('文章更新成功！');
        navigate(`/post/${id}`);
      } else {
        // 创建模式 - 创建新文章
        const newArticle = {
          id: Date.now().toString(),
          title,
          content,
          category: categoryName,
          tags: selectedTagNames,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          excerpt: excerpt || content.substring(0, 150),
          views: 0,
          likes: 0,
          coverImage: coverImage,
          author: {
            id: '1',
            name: '博主名称',
            avatar: 'https://via.placeholder.com/150'
          }
        };

        storedPosts.push(newArticle);
        localStorage.setItem('blogPosts', JSON.stringify(storedPosts));
        alert('文章发布成功！');
        navigate('/');
      }
    } catch (error) {
      console.error('保存文章失败:', error);
      alert('保存文章失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="article-upload-container">
      <h1 className="page-title">{isEditMode ? '编辑文章' : '发布新文章'}</h1>
      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label htmlFor="title">文章标题</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入文章标题"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">文章摘要</label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="输入文章摘要（最多150字）"
            maxLength={150}
            className="form-control"
          />
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="category">分类</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="form-control"
            >
              <option value="">选择分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="tags">标签（可多选）</label>
            <select
              id="tags"
              multiple
              value={selectedTags}
              onChange={handleTagChange}
              className="form-control"
            >
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <small className="form-text">按住Ctrl键可多选标签</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="coverImage">文章封面图</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control"
          />
          {coverImagePreview && (
            <img 
              src={coverImagePreview} 
              alt="封面预览"
              className="cover-preview"
              style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '4px' }}
            />
          )}
        </div>

        <div className="form-group">
          <label>文章内容（Markdown格式）</label>
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            height={500}
            className="md-editor"
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '发布中...' : '发布文章'}
        </button>
      </form>
    </div>
  );
};

export default ArticleUpload;