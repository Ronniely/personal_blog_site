<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- 移动端菜单按钮 -->
        <button 
          class="menu-button" 
          @click="toggleMenu" 
          aria-label="打开菜单"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Logo -->
        <div class="logo">
          <router-link to="/" class="logo-link">
            <h1 class="logo-text">个人博客</h1>
          </router-link>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="nav-desktop">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link">首页</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/articles" class="nav-link">文章</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/categories" class="nav-link">分类</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/tags" class="nav-link">标签</router-link>
            </li>
          </ul>
        </nav>

        <!-- 用户操作按钮 -->
        <div class="user-actions">
          <router-link to="/login" class="login-button">登录</router-link>
          <router-link to="/upload" class="upload-button">写文章</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

const props = defineProps<{
  toggleMenu: () => void;
}>();
</script>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: none;
}

.logo-link {
  text-decoration: none;
  color: #333;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  padding: 8px 0;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #4a6fa5;
}

.user-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.login-button, .upload-button {
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.login-button {
  color: #4a6fa5;
  background-color: transparent;
}

.login-button:hover {
  background-color: #f0f7ff;
}

.upload-button {
  background-color: #4a6fa5;
  color: white;
}

.upload-button:hover {
  background-color: #3a5a8c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .menu-button {
    display: block;
  }
  
  .nav-desktop {
    display: none;
  }
  
  .user-actions {
    display: none;
  }
}
</style>