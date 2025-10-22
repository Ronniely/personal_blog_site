<template>
  <Layout :sidebar="true">
    <div class="home-page">
      <div class="articles-container">
        <h2 class="page-title">最新文章</h2>

        <!-- 文章列表 -->
        <div class="articles-list">
          <article v-for="article in articles" :key="article.id" class="article-card">
            <router-link :to="`/article/${article.id}`" class="article-link">
              <div class="article-image-container">
                <img :src="article.coverImage || '/src/assets/default-cover.jpg'" :alt="article.title"
                  class="article-image" loading="lazy" />
              </div>

              <div class="article-content">
                <div class="article-meta">
                  <span class="article-category">
                    {{ article.category?.name || '未分类' }}
                  </span>
                  <span class="article-date">{{ formatDate(article.createdAt) }}</span>
                </div>

                <h3 class="article-title">{{ article.title }}</h3>

                <p class="article-excerpt">{{ article.excerpt }}</p>

                <div class="article-footer">
                  <div class="article-author">
                    <img :src="article.author?.avatar || '/src/assets/default-avatar.png'" :alt="article.author?.name"
                      class="author-avatar" />
                    <span class="author-name">{{ article.author?.name || '作者' }}</span>
                  </div>

                  <div class="article-stats">
                    <span class="stat-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path
                          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                        </path>
                      </svg>
                      {{ article.views || 0 }}
                    </span>
                    <span class="stat-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path
                          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                        </path>
                      </svg>
                      {{ article.comments?.length || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </article>
        </div>

        <!-- 加载更多按钮 -->
        <div class="load-more-container">
          <button class="load-more-button" @click="loadMore" :disabled="loading">
            <span v-if="loading">加载中...</span>
            <span v-else>加载更多</span>
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import type { BlogPost } from '../types';
import dayjs from 'dayjs';
import Layout from '../views/Home/Layout.vue';
import { articleAPI } from '../services/apiService';

// 模拟文章数据 - 实际项目中应该从API获取
const articles = ref<BlogPost[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = 10;

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return dayjs(dateString).format('YYYY-MM-DD');
};

// 加载文章列表
const loadArticles = async () => {
  loading.value = true;

  try {
    // 从API获取文章数据
    const response = await articleAPI.getArticles(currentPage.value, pageSize);

    if (response.code === 200) {
      const newArticles = response.data || [];

      if (currentPage.value === 1) {
        articles.value = newArticles;
      } else {
        articles.value.push(...newArticles);
      }

      // 如果没有更多文章，禁用加载更多按钮
      if (newArticles.length < pageSize) {
        isNoMoreArticles.value = true;
      }
    } else {
      // API请求失败，使用模拟数据
      console.warn('从API获取文章失败，使用模拟数据');
      const mockArticles = generateMockArticles();
      const startIndex = (currentPage.value - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedArticles = mockArticles.slice(startIndex, endIndex);

      if (currentPage.value === 1) {
        articles.value = paginatedArticles;
      } else {
        articles.value.push(...paginatedArticles);
      }

      if (paginatedArticles.length < pageSize) {
        isNoMoreArticles.value = true;
      }
    }
  } catch (error) {
    console.error('加载文章失败:', error);

    // 网络错误时使用模拟数据
    const mockArticles = generateMockArticles();
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = mockArticles.slice(startIndex, endIndex);

    if (currentPage.value === 1) {
      articles.value = paginatedArticles;
    } else {
      articles.value.push(...paginatedArticles);
    }

    if (paginatedArticles.length < pageSize) {
      isNoMoreArticles.value = true;
    }
  } finally {
    loading.value = false;
  }
};

// 标记是否没有更多文章
const isNoMoreArticles = ref(false);

// 加载更多文章
const loadMore = () => {
  if (!loading.value && !isNoMoreArticles.value) {
    currentPage.value++;
    loadArticles();
  }
};

// 生成模拟文章数据
const generateMockArticles = (): BlogPost[] => {
  const categories = ['前端开发', '后端开发', '数据库', '工具技巧'];
  const tags = ['JavaScript', 'Vue', 'React', 'TypeScript', 'Node.js', 'CSS', 'HTML', 'Go'];
  const titles = [
    'Vue 3 Composition API 实战指南',
    'React Hooks 深度解析',
    'TypeScript 高级类型技巧',
    'Node.js 性能优化策略',
    'CSS Grid 布局完全指南',
    'Go语言并发编程',
    'MySQL 查询优化实战',
    '前端状态管理的演进',
    '现代Web应用安全最佳实践',
    'GraphQL 入门到精通'
  ];

  return titles.map((title, index) => ({
    id: `post-${index + 1}`,
    title,
    excerpt: '这是文章的摘要内容，包含了文章的主要观点和核心内容，让读者能够快速了解文章的大致内容。',
    content: '# 文章标题\n\n这是文章的详细内容，包含了各种章节、段落、代码块和图片等。\n\n## 章节一\n\n这里是章节一的内容...\n\n## 章节二\n\n这里是章节二的内容...',
    coverImage: `/src/assets/default-cover.jpg`,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(), // 每天一篇
    updatedAt: new Date(Date.now() - index * 86400000).toISOString(),
    author: {
      id: '1',
      name: '黄文杰',
      avatar: '/src/assets/download.webp'
    },
    category: {
      id: `category-${index % categories.length + 1}`,
      name: categories[index % categories.length] || '未分类'
    },
    tags: [
      { id: `tag-${index % tags.length + 1}`, name: tags[index % tags.length] || '未分类标签' },
      { id: `tag-${(index + 1) % tags.length + 1}`, name: tags[(index + 1) % tags.length] || '未分类标签' }
    ],
    views: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 50),
    comments: []
  }));
};

// 组件挂载时加载文章
onMounted(() => {
  loadArticles();
});
</script>

<style scoped>
.home-page {
  padding: 20px 0;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.articles-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

@media (min-width: 768px) {
  .articles-list {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

.article-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.article-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.article-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.article-card:hover .article-image {
  transform: scale(1.05);
}

.article-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
}

.article-category {
  background-color: #f0f7ff;
  color: #4a6fa5;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
}

.article-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
}

.article-excerpt {
  color: #666;
  line-height: 1.6;
  font-size: 14px;
  margin-bottom: 20px;
  flex: 1;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 14px;
  color: #333;
}

.article-stats {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #999;
}

.load-more-container {
  margin-top: 40px;
  text-align: center;
}

.load-more-button {
  padding: 12px 24px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.load-more-button:hover:not(:disabled) {
  background-color: #3a5a8c;
}

.load-more-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>