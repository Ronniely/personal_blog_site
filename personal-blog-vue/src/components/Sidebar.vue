<template>
  <aside class="sidebar">
    <!-- 关于博主 -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">关于博主</h3>
      <div class="about-author">
        <div class="author-avatar">
          <span class="avatar-initials">HJ</span>
        </div>
        <h4 class="author-name">黄文杰</h4>
        <p class="author-bio">热爱技术和分享的开发者，专注于前端技术、编程思想和个人成长。</p>
        <div class="social-links">
          <a href="#" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- 搜索框（移动端） -->
    <div class="sidebar-section mobile-search">
      <div class="search-form">
        <input type="text" placeholder="搜索文章..." class="search-input" />
        <button type="submit" class="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- 分类 -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">分类</h3>
      <ul class="category-list">
        <li v-for="category in categories" :key="category.id">
          <router-link :to="`/category/${category.id}`" class="category-link">
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.count }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 标签 -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">标签</h3>
      <div class="tags-cloud">
        <router-link v-for="tag in tags" :key="tag.id" :to="`/tag/${tag.id}`" class="tag-link">
          {{ tag.name }}
          <span v-if="tag.count" class="tag-count">{{ tag.count }}</span>
        </router-link>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Category, Tag } from '../types';

// 获取分类数据 - 这里使用模拟数据，实际应该从API或localStorage获取
const categories = ref<Category[]>([
  { id: '1', name: '前端开发', count: 10 },
  { id: '2', name: '后端开发', count: 5 },
  { id: '3', name: '数据库', count: 3 },
  { id: '4', name: '工具技巧', count: 8 }
]);

// 标签数据
const tags = ref<Tag[]>([
  { id: '1', name: 'JavaScript', count: 15 },
  { id: '2', name: 'Vue', count: 8 },
  { id: '3', name: 'React', count: 6 },
  { id: '4', name: 'TypeScript', count: 12 },
  { id: '5', name: 'Node.js', count: 7 },
  { id: '6', name: 'CSS', count: 9 },
  { id: '7', name: 'HTML', count: 4 },
  { id: '8', name: 'Go', count: 3 }
]);

onMounted(() => {
  // 实际项目中，这里应该从API或localStorage加载分类和标签数据
  // 可以调用之前创建的categoryManager中的函数
});
</script>

<style scoped>
.sidebar {
  padding: 20px;
}

.sidebar-section {
  margin-bottom: 30px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  position: relative;
  padding-bottom: 8px;
}

.sidebar-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #4a6fa5;
}

/* 关于博主样式 */
.about-author {
  text-align: center;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
  background-color: #4a6fa5;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.avatar-initials {
  line-height: 1;
}

.author-name {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0 5px;
  color: #333;
}

.author-bio {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-links a {
  color: #666;
  transition: color 0.2s;
}

.social-links a:hover {
  color: #4a6fa5;
}

/* 搜索框样式 */
.search-form {
  display: flex;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.search-button {
  padding: 8px 12px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

/* 分类列表样式 */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.category-link:hover {
  color: #4a6fa5;
}

.category-count {
  color: #999;
  font-size: 12px;
}

/* 标签云样式 */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-link {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background-color: #f0f0f0;
  color: #666;
  text-decoration: none;
  border-radius: 15px;
  font-size: 13px;
  transition: all 0.2s;
}

.tag-link:hover {
  background-color: #4a6fa5;
  color: white;
}

.tag-count {
  margin-left: 5px;
  font-size: 11px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mobile-search {
    display: block;
  }
}

@media (min-width: 769px) {
  .mobile-search {
    display: none;
  }
}
</style>