<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2 class="login-title">注册账号</h2>
        <p class="login-subtitle">创建新账号，开始使用个人博客</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder="请设置用户名"
            required
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <label for="email" class="form-label">邮箱</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="请输入邮箱"
            required
            autocomplete="email"
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
              placeholder="请设置密码（至少6位）"
              required
              minlength="6"
              autocomplete="new-password"
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
        
        <div class="form-group">
          <label for="confirmPassword" class="form-label">确认密码</label>
          <div class="password-input-container">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请再次输入密码"
              required
              minlength="6"
              autocomplete="new-password"
            />
          </div>
        </div>
        
        <button
          type="submit"
          class="login-button"
          :disabled="loading"
        >
          <span v-if="loading">注册中...</span>
          <span v-else>注册</span>
        </button>
        
        <div class="register-link-container">
          <p class="register-text">
            已有账号？<router-link to="/login" class="register-link">立即登录</router-link>
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
  email: '',
  password: '',
  confirmPassword: ''
});

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 处理注册
const handleRegister = async () => {
  // 表单验证
  if (!form.value.username.trim()) {
    ElMessage.error('请填写用户名');
    return;
  }
  
  if (!form.value.email.trim()) {
    ElMessage.error('请填写邮箱');
    return;
  }
  
  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    ElMessage.error('请输入有效的邮箱地址');
    return;
  }
  
  if (!form.value.password || form.value.password.length < 6) {
    ElMessage.error('密码至少需要6位字符');
    return;
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }
  
  loading.value = true;
  
  try {
    // 调用后端API进行用户注册
    await userAPI.register(form.value.username, form.value.password, form.value.email);
    
    ElMessage.success('注册成功，请登录');
    
    // 注册成功后跳转到登录页
    router.push('/login');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '注册失败，请稍后重试';
    ElMessage.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

// 检查是否已登录，如果已登录则跳转到首页
const checkLoginStatus = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) {
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
}
</style>