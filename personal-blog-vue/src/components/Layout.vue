<template>
  <div class="layout">
    <!-- 头部组件 -->
    <Header :toggleMenu="toggleMenu" />
    
    <!-- 移动端菜单 -->
    <div 
      :class="['mobile-menu-overlay', { open: menuOpen }]"
      @click="setMenuOpen(false)"
    >
      <div 
        :class="['mobile-menu', { open: menuOpen }]" 
        @click.stop
      >
        <Sidebar />
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- 侧边栏（桌面端） -->
          <aside v-if="sidebar" class="sidebar-desktop"><Sidebar /></aside>
          
          <!-- 内容 -->
          <div class="content"><slot /></div>
        </div>
      </div>
    </main>

    <!-- 页脚组件 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import Footer from './Footer.vue';

const props = defineProps<{
  sidebar?: boolean;
}>();

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const setMenuOpen = (value: boolean) => {
  menuOpen.value = value;
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-wrapper {
  display: flex;
  gap: 30px;
}

.sidebar-desktop {
  width: 300px;
  flex-shrink: 0;
}

.content {
  flex: 1;
}

/* 移动端菜单样式 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.mobile-menu-overlay.open {
  opacity: 1;
  visibility: visible;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background-color: #fff;
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s;
  overflow-y: auto;
}

.mobile-menu.open {
  transform: translateX(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar-desktop {
    display: none;
  }
  
  .content-wrapper {
    flex-direction: column;
    gap: 20px;
  }
}
</style>