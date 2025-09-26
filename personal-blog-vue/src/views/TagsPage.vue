<template>
  <Layout sidebar="true">
    <div class="tags-page">
      <div class="page-header">
        <h1 class="page-title">热门标签</h1>
        <p class="page-description">浏览所有的文章标签，发现感兴趣的内容</p>
      </div>
      
      <div class="tags-container">
        <!-- 标签云 -->
        <div class="tags-cloud">
          <router-link 
            v-for="tag in tags"
            :key="tag.id"
            :to="`/tag/${tag.id}`"
            class="tag-item"
            :style="getTagStyle(tag)"
          >
            <span class="tag-name">{{ tag.name }}</span>
            <span class="tag-count">({{ tag.count }})</span>
          </router-link>
        </div>
        
        <!-- 标签列表 -->
        <div class="tags-list">
          <h2 class="section-title">所有标签</h2>
          <div class="tags-grid">
            <div 
              v-for="tag in sortedTags"
              :key="tag.id"
              class="tag-card"
            >
              <router-link :to="`/tag/${tag.id}`" class="tag-link">
                <div class="tag-card-content">
                  <div class="tag-card-header">
                    <span class="tag-card-name">{{ tag.name }}</span>
                    <span class="tag-card-count">{{ tag.count }} 篇</span>
                  </div>
                  <div class="tag-card-stats">
                    <span class="tag-card-posts">{{ getRandomPopularity() }} 热度</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import type { Tag } from '../types';
import Layout from '../components/Layout.vue';

// 标签数据
const tags = ref<Tag[]>([]);

// 按文章数量排序的标签
const sortedTags = computed(() => {
  return [...tags.value].sort((a, b) => b.count - a.count);
});

// 获取随机热度值（模拟数据）
const getRandomPopularity = () => {
  return Math.floor(Math.random() * 900) + 100;
};

// 根据文章数量获取标签样式
const getTagStyle = (tag: Tag) => {
  // 基于文章数量计算标签大小和颜色
  const baseSize = 14;
  const maxSize = 24;
  const sizeRange = maxSize - baseSize;
  
  const maxCount = Math.max(...tags.value.map(t => t.count), 1);
  const sizeFactor = Math.min(tag.count / maxCount, 1);
  const fontSize = baseSize + (sizeFactor * sizeRange);
  
  // 基于文章数量计算颜色强度
  const hue = 210; // 蓝色色调
  const saturation = 70 + (sizeFactor * 20); // 70% 到 90%
  const lightness = 45 + ((1 - sizeFactor) * 10); // 45% 到 55%
  
  return {
    fontSize: `${fontSize}px`,
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    color: 'white'
  };
};

// 获取标签数据
const fetchTags = async () => {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从localStorage获取文章数据来计算每个标签的文章数量
    const storedArticles = localStorage.getItem('blogPosts');
    const articlesData = storedArticles ? JSON.parse(storedArticles) : [];
    
    // 初始化标签数据
    const initialTags: Tag[] = [
      { id: '1', name: 'JavaScript', count: 0 },
      { id: '2', name: 'Vue', count: 0 },
      { id: '3', name: 'React', count: 0 },
      { id: '4', name: 'TypeScript', count: 0 },
      { id: '5', name: 'Node.js', count: 0 },
      { id: '6', name: 'CSS', count: 0 },
      { id: '7', name: 'HTML', count: 0 },
      { id: '8', name: 'Go', count: 0 }
    ];
    
    // 计算每个标签的文章数量
    initialTags.forEach(tag => {
      tag.count = articlesData.reduce((count: number, article: any) => {
        if (article.tags && article.tags.some((t: any) => t.id === tag.id)) {
          return count + 1;
        }
        return count;
      }, 0);
    });
    
    // 只保留有文章的标签
    const tagsWithArticles = initialTags.filter(tag => tag.count > 0);
    
    tags.value = tagsWithArticles;
  } catch (error) {
    console.error('获取标签数据失败:', error);
  }
};

// 组件挂载时获取标签数据
onMounted(() => {
  fetchTags();
});
</script>

<style scoped>
.tags-page {
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

.tags-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 标签云样式 */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 60px;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  cursor: pointer;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tag-count {
  font-size: 0.85em;
  opacity: 0.9;
}

/* 标签列表样式 */
.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.tag-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
}

.tag-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.tag-link {
  display: block;
  padding: 20px;
  text-decoration: none;
  color: inherit;
}

.tag-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tag-card-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.tag-card-count {
  font-size: 14px;
  color: #666;
  background-color: #f0f7ff;
  padding: 4px 10px;
  border-radius: 12px;
}

.tag-card-stats {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 767px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-description {
    font-size: 16px;
  }
  
  .tags-cloud {
    padding: 20px;
    gap: 10px;
  }
  
  .tags-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .tag-card {
    padding: 15px;
  }
  
  .tag-card-name {
    font-size: 16px;
  }
}
</style>