<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2 class="login-title">登录个人博客</h2>
        <p class="login-subtitle">欢迎回来，请登录您的账号</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder="请输入用户名"
            required
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请输入密码"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="toggle-password-button"
              @click="togglePasswordVisibility"
              aria-label="切换密码可见性"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path v-if="showPassword" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle v-if="showPassword" cx="12" cy="12" r="3"></circle>
                <path v-else d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="form-options">
          <label class="remember-me-container">
            <input
              type="checkbox"
              v-model="form.rememberMe"
              class="remember-me-checkbox"
            />
            <span class="remember-me-label">记住我</span>
          </label>
          
          <a href="#" class="forgot-password-link">忘记密码？</a>
        </div>
        
        <button
          type="submit"
          class="login-button"
          :disabled="loading"
        >
          <span v-if="loading">登录中...</span>
          <span v-else>登录</span>
        </button>
        
        <div class="register-link-container">
          <p class="register-text">
            还没有账号？<router-link to="/register" class="register-link">立即注册</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { userAPI } from '../services/apiService';

const router = useRouter();
const loading = ref(false);
const showPassword = ref(false);

const form = ref({
  username: '',
  password: '',
  rememberMe: false
});

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 处理登录
const handleLogin = async () => {
  // 表单验证
  if (!form.value.username.trim() || !form.value.password.trim()) {
    ElMessage.error('请填写用户名和密码');
    return;
  }
  
  loading.value = true;
  
  try {
    // 调用后端API进行登录验证
    const response = await userAPI.login(form.value.username, form.value.password);
    
    // 登录成功，保存用户信息和token
    const userInfo = {
      id: '', // 响应中没有提供id，设置为空字符串
      username: form.value.username, // 从表单中获取用户名
      role: 'user', // 默认为普通用户角色
      token: response.data.token
    };
    
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('isLoggedIn', 'true');
    
    // 如果勾选了记住我，可以保存更持久的登录状态
    if (form.value.rememberMe) {
      // 这里可以设置更长期的存储，比如使用cookie
    }
    
    ElMessage.success('登录成功');
    
    // 登录成功后跳转到首页或之前的页面
    router.push('/');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '登录失败，请稍后重试';
    ElMessage.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

// 页面加载时检查是否已登录
const checkLoginStatus = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) {
    // 如果已登录，直接跳转到首页
    router.push('/');
  }
};

// 组件挂载时检查登录状态
checkLoginStatus();
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #666;
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4a6fa5;
}

.form-input::placeholder {
  color: #999;
}

.password-input-container {
  position: relative;
}

.toggle-password-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
}

.toggle-password-button:hover {
  color: #4a6fa5;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

.remember-me-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.remember-me-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.remember-me-label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.forgot-password-link {
  font-size: 14px;
  color: #4a6fa5;
  text-decoration: none;
}

.forgot-password-link:hover {
  text-decoration: underline;
}

.login-button {
  padding: 12px 24px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

.login-button:hover:not(:disabled) {
  background-color: #3a5a8c;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.register-link-container {
  text-align: center;
  margin-top: 15px;
}

.register-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.register-link {
  color: #4a6fa5;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>