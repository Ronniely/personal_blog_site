<template>
  <Layout :sidebar="true">
    <div class="categories-page">
      <div class="page-header">
        <h1 class="page-title">文章分类</h1>
        <p class="page-description">浏览所有的文章分类，查看相关主题的内容</p>
      </div>
      
      <div class="categories-container">
        <div class="categories-list">
          <div 
            v-for="category in categories"
            :key="category.id"
            class="category-card"
          >
            <router-link :to="`/category/${category.id}`" class="category-link">
              <div class="category-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              
              <div class="category-info">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-count">{{ category.count }} 篇文章</p>
                <p class="category-description">{{ getCategoryDescription(category.id) }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import type { Category } from '../types';
import Layout from '../components/Layout.vue';
import { categoryAPI } from '../services/apiService';

// 分类数据
const categories = ref<Category[]>([]);

// 获取分类描述
const getCategoryDescription = (categoryId: string) => {
  const descriptions: Record<string, string> = {
    '1': '前端开发相关的技术文章，包括JavaScript、Vue、React等框架的使用和技巧。',
    '2': '后端开发相关的技术文章，包括Node.js、Go、数据库等技术的使用和最佳实践。',
    '3': '数据库相关的技术文章，包括MySQL、MongoDB等数据库的使用和优化技巧。',
    '4': '开发工具和效率提升相关的文章，包括编辑器、终端、版本控制等工具的使用技巧。'
  };
  
  return descriptions[categoryId] || '该分类下的文章集合';
};

// 获取分类数据
const fetchCategories = async () => {
  try {
    // 从API获取分类数据
    const response = await categoryAPI.getCategories();
    
    if (response.code === 200 && response.data) {
      // 按文章数量排序（降序）
      const sortedCategories = response.data.sort((a: Category, b: Category) => (b.count || 0) - (a.count || 0));
      categories.value = sortedCategories;
    } else {
      console.error('获取分类数据失败:', response.msg || '未知错误');
      // 如果API请求失败，使用本地模拟数据
      categories.value = [
        { id: '1', name: '前端开发', count: 0 },
        { id: '2', name: '后端开发', count: 0 },
        { id: '3', name: '数据库', count: 0 },
        { id: '4', name: '工具技巧', count: 0 }
      ];
    }
  } catch (error) {
    console.error('获取分类数据失败:', error);
    // 错误情况下使用模拟数据
    categories.value = [
      { id: '1', name: '前端开发', count: 0 },
      { id: '2', name: '后端开发', count: 0 },
      { id: '3', name: '数据库', count: 0 },
      { id: '4', name: '工具技巧', count: 0 }
    ];
  }
};

// 组件挂载时获取分类数据
onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.categories-page {
  padding: 40px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.page-description {
  font-size: 18px;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

.categories-container {
  max-width: 1200px;
  margin: 0 auto;
}

.categories-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .categories-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .categories-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .categories-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

.category-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.category-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.category-icon {
  margin-bottom: 20px;
  color: #4a6fa5;
  background-color: #f0f7ff;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-info {
  text-align: center;
}

.category-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.category-count {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.category-description {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 767px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-description {
    font-size: 16px;
  }
  
  .category-icon {
    width: 60px;
    height: 60px;
  }
  
  .category-icon svg {
    width: 36px;
    height: 36px;
  }
  
  .category-name {
    font-size: 18px;
  }
}
</style>