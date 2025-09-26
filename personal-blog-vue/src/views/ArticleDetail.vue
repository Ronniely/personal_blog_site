<template>
  <Layout :sidebar="true">
    <div class="article-detail">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <router-link to="/" class="back-button">返回首页</router-link>
      </div>
      
      <div v-else-if="article" class="article-container">
        <!-- 文章头部 -->
        <div class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          
          <div class="article-meta">
            <div class="author-info">
              <img 
                :src="article.author?.avatar || '/src/assets/default-avatar.png'"
                :alt="article.author?.name"
                class="author-avatar"
              />
              <div class="author-details">
                <span class="author-name">{{ article.author?.name || '作者' }}</span>
                <span class="publish-date">{{ formatDate(article.createdAt) }}</span>
              </div>
            </div>
            
            <div class="article-stats">
              <span class="stat-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                {{ article.views || 0 }} 阅读
              </span>
              <span class="stat-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                {{ comments.length }} 评论
              </span>
            </div>
          </div>
          
          <div class="article-categories-tags">
            <div class="categories">
              <span class="category-label">分类：</span>
              <router-link 
                v-if="article.category"
                :to="`/category/${article.category.id}`"
                class="category-link"
              >
                {{ article.category.name }}
              </router-link>
            </div>
            
            <div class="tags">
              <span class="tags-label">标签：</span>
              <router-link 
                v-for="tag in article.tags" 
                :key="tag.id"
                :to="`/tag/${tag.id}`"
                class="tag-link"
              >
                {{ tag.name }}
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- 文章封面 -->
        <div v-if="article.coverImage" class="article-cover">
          <img 
            :src="article.coverImage"
            :alt="article.title"
            class="cover-image"
          />
        </div>
        
        <!-- 文章内容 -->
        <div class="article-content">
          <div class="content-wrapper">
            <!-- 这里应该使用富文本渲染器，比如marked.js或markdown-it -->
            <!-- 为了简化，我们直接渲染内容 -->
            <div v-html="renderedContent"></div>
          </div>
        </div>
        
        <!-- 文章操作 -->
        <div class="article-actions">
          <button class="action-button like-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            点赞 ({{ article.likes || 0 }})
          </button>
          
          <button class="action-button share-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            分享
          </button>
          
          <button class="action-button save-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            收藏
          </button>
        </div>
        
        <!-- 评论区 -->
        <div class="comments-section">
          <h3 class="comments-title">评论 ({{ comments.length }})</h3>
          
          <!-- 评论表单 -->
          <div class="comment-form">
            <textarea 
              v-model="commentText"
              placeholder="写下你的评论..."
              class="comment-input"
            ></textarea>
            <button 
              class="submit-comment-button"
              @click="submitComment"
              :disabled="!commentText.trim()"
            >
              提交评论
            </button>
          </div>
          
          <!-- 评论列表 -->
          <div class="comments-list">
            <div 
              v-for="comment in comments"
              :key="comment.id"
              class="comment-item"
            >
              <img 
                :src="comment.author.avatar || '/src/assets/default-avatar.png'"
                :alt="comment.author.name"
                class="comment-author-avatar"
              />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author-name">{{ comment.author.name }}</span>
                  <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <div class="comment-actions">
                  <button class="comment-action">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {{ comment.likes || 0 }}
                  </button>
                  <button class="comment-action">回复</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import type { BlogPost, Comment as CommentType } from '../types';
import dayjs from 'dayjs';
import Layout from '../components/Layout.vue';
import { articleAPI } from '../services/apiService';

const route = useRoute();
const articleId = route.params.id as string;

const loading = ref(true);
const error = ref('');
const article = ref<BlogPost | null>(null);
const commentText = ref('');
const comments = ref<CommentType[]>([]);

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

// 渲染文章内容（简化版，实际项目应使用markdown渲染器）
const renderedContent = computed(() => {
  if (!article.value) return '';
  // 这里简单地将markdown转换为HTML（实际项目应使用专业库）
  let content = article.value.content;
  
  // 简单的markdown解析
  content = content.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  content = content.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  content = content.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  content = content.replace(/\n\n([^\n]+)\n\n/gm, '<p>$1</p>');
  
  return content;
});

// 获取文章详情
const fetchArticleDetail = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // 从API获取文章数据
    const response = await articleAPI.getArticleDetail(articleId);
    if (response.code === 200 && response.data) {
      article.value = response.data;
      comments.value = response.data.comments || [];
    } else {
      error.value = response.msg || '获取文章详情失败';
      // 使用模拟数据
      setMockData();
    }
  } catch (err) {
    error.value = '网络错误，请稍后再试';
    console.error('获取文章详情失败:', err);
    // 使用模拟数据
    setMockData();
  } finally {
    loading.value = false;
  }
};

// 设置模拟数据
function setMockData() {
  const mockArticle: BlogPost = {
    id: articleId,
    title: 'Vue 3 Composition API 实践指南',
    content: '# Vue 3 Composition API\n\nVue 3 的 Composition API 提供了一种更灵活的方式来组织和重用组件逻辑...',
    category: { id: '1', name: '前端开发' },
    tags: [
      { id: '1', name: 'Vue' },
      { id: '2', name: 'JavaScript' }
    ],
    excerpt: 'Vue 3 的 Composition API 提供了一种更灵活的方式来组织和重用组件逻辑...',
    coverImage: 'https://picsum.photos/id/1/800/400',
    createdAt: '2023-07-15T10:30:00Z',
    updatedAt: '2023-07-15T10:30:00Z',
    views: 1250,
    likes: 86,
    author: {
      id: '1',
      name: '张三',
      avatar: 'https://picsum.photos/id/64/40/40',
      bio: '前端开发工程师'
    },
    comments: [
      {
        id: '1',
        postId: articleId,
        author: {
          id: '2',
          name: '李四',
          avatar: 'https://picsum.photos/id/65/40/40'
        },
        content: '这篇文章写得很好，学到了很多！',
        createdAt: '2023-07-16T09:15:00Z',
        likes: 5,
        replies: []
      },
      {
        id: '2',
        postId: articleId,
        author: {
          id: '3',
          name: '王五',
          avatar: 'https://picsum.photos/id/66/40/40'
        },
        content: 'Composition API 确实比 Options API 更灵活',
        createdAt: '2023-07-16T14:30:00Z',
        likes: 3,
        replies: []
      }
    ]
  };

  article.value = mockArticle;
  comments.value = mockArticle.comments || [];
};

// 提交评论
const submitComment = async () => {
  if (!commentText.value.trim()) {
    return;
  }
  
  try {
    // 从API提交评论
    const response = await articleAPI.createComment(articleId, commentText.value.trim());
    
    if (response.code === 200 && response.data) {
      // 添加新评论到列表
      const newComment: CommentType = {
        id: response.data.id,
        postId: articleId,
        author: {
          id: response.data.author.id,
          name: response.data.author.name,
          avatar: response.data.author.avatar
        },
        content: response.data.content,
        createdAt: response.data.createdAt,
        likes: 0,
        replies: []
      };
      comments.value.push(newComment);
      
      // 清空评论输入框
      commentText.value = '';
    } else {
      throw new Error(response.msg || '提交评论失败');
    }
  } catch (error) {
    console.error('提交评论失败:', error);
    alert('提交评论失败，请稍后重试');
  }
};

// 组件挂载时获取文章详情
onMounted(() => {
  fetchArticleDetail();
});
</script>

<style scoped>
.article-detail {
  padding: 40px 0;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4a6fa5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container p {
  color: #ff4d4f;
  margin-bottom: 20px;
}

.back-button {
  padding: 8px 16px;
  background-color: #4a6fa5;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #3a5a8c;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
}

.article-header {
  margin-bottom: 30px;
}

.article-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 20px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-weight: bold;
  color: #333;
}

.publish-date {
  font-size: 12px;
  color: #666;
}

.article-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.article-categories-tags {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.categories,
.tags {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.category-label,
.tags-label {
  font-size: 14px;
  color: #666;
}

.category-link,
.tag-link {
  padding: 4px 12px;
  background-color: #f0f7ff;
  color: #4a6fa5;
  text-decoration: none;
  border-radius: 15px;
  font-size: 12px;
  transition: background-color 0.2s;
}

.category-link:hover,
.tag-link:hover {
  background-color: #e0efff;
}

.article-cover {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: auto;
  display: block;
}

.article-content {
  margin-bottom: 40px;
}

.content-wrapper {
  line-height: 1.8;
  color: #333;
  font-size: 16px;
}

.content-wrapper h1, .content-wrapper h2, .content-wrapper h3 {
  margin: 30px 0 20px 0;
  color: #333;
}

.content-wrapper p {
  margin-bottom: 20px;
}

.content-wrapper img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 20px 0;
}

.article-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #f0f7ff;
  border-color: #4a6fa5;
  color: #4a6fa5;
}

.comments-section {
  margin-top: 60px;
}

.comments-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
}

.comment-form {
  margin-bottom: 40px;
}

.comment-input {
  width: 100%;
  min-height: 120px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  margin-bottom: 15px;
}

.submit-comment-button {
  padding: 10px 24px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-comment-button:hover:not(:disabled) {
  background-color: #3a5a8c;
}

.submit-comment-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.comment-author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.comment-author-name {
  font-weight: bold;
  color: #333;
}

.comment-date {
  font-size: 12px;
  color: #666;
}

.comment-text {
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
}

.comment-actions {
  display: flex;
  gap: 20px;
}

.comment-action {
  background: none;
  border: none;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s;
}

.comment-action:hover {
  color: #4a6fa5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-title {
    font-size: 24px;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-actions {
    flex-wrap: wrap;
  }
  
  .comment-item {
    flex-direction: column;
    gap: 10px;
  }
}
</style>