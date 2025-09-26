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
          <template v-if="isLoggedIn">
            <!-- 用户头像和退出登录 -->
            <div class="user-profile" @click="toggleProfileMenu">
              <div class="avatar" :style="{ backgroundColor: avatarColor }">
                {{ userInitial }}
              </div>
              <div class="profile-menu" :class="{ open: profileMenuOpen }" @click.stop>
                <div class="profile-info">
                  <p class="username">{{ userInfo?.username }}</p>
                  <p class="user-role">{{ userInfo?.role }}</p>
                </div>
                <button class="logout-button" @click="handleLogout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  退出登录
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="login-button">登录</router-link>
          </template>
          <router-link to="/upload" class="upload-button">写文章</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  toggleMenu: () => void;
}>();

// 访问props以消除未使用的警告
const { toggleMenu } = props;

const router = useRouter();
const isLoggedIn = ref(false);
const userInfo = ref<any>(null);
const profileMenuOpen = ref(false);

// 计算属性：获取用户名首字母作为头像显示
const userInitial = computed(() => {
  if (!userInfo.value?.username) return '';
  return userInfo.value.username.charAt(0).toUpperCase();
});

// 计算属性：根据用户名生成头像背景色
const avatarColor = computed(() => {
  if (!userInfo.value?.username) return '#4a6fa5';
  const colors = ['#4a6fa5', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  // 显式指定reduce的类型参数
  const hash = Array.from(userInfo.value.username).reduce<number>((acc, char:any) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return colors[Math.abs(hash) % colors.length];
});

// 检查登录状态
const checkLoginStatus = () => {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userData = localStorage.getItem('userInfo');
  
  isLoggedIn.value = loggedIn;
  if (userData) {
    try {
      userInfo.value = JSON.parse(userData);
    } catch (error) {
      console.error('解析用户信息失败:', error);
      userInfo.value = null;
    }
  }
};

// 切换用户菜单显示
const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value;
};

// 处理退出登录
const handleLogout = () => {
  // 清除localStorage中的登录信息
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userInfo');
  
  // 更新状态
  isLoggedIn.value = false;
  userInfo.value = null;
  profileMenuOpen.value = false;
  
  // 显示退出成功消息
  ElMessage.success('退出登录成功');
  
  // 跳转到首页
  router.push('/');
};

// 点击页面其他地方关闭用户菜单
const handleClickOutside = (event: MouseEvent) => {
  const profileElement = document.querySelector('.user-profile');
  if (profileElement && !profileElement.contains(event.target as Node)) {
    profileMenuOpen.value = false;
  }
};

// 组件挂载时检查登录状态
onMounted(() => {
  checkLoginStatus();
  document.addEventListener('click', handleClickOutside);
});
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

.user-profile {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 16px;
  transition: transform 0.2s;
}

.avatar:hover {
  transform: scale(1.05);
}

.profile-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  padding: 12px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
  z-index: 1000;
}

.profile-menu.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.profile-info {
  padding: 0 16px 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
}

.username {
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.logout-button {
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s, color 0.2s;
}

.logout-button:hover {
  background-color: #f5f5f5;
  color: #e74c3c;
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