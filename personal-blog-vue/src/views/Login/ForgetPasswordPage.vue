<template>
  <div class="forget-page">
    <div class="forget-container">
      <div class="forget-header">
        <h2>找回密码</h2>
        <p class="subtitle">请输入您的邮箱，我们将发送重置链接</p>
      </div>
      <div class="forget-form">
        <n-input v-model:value="email" class="mt-11" placeholder="邮箱" @keyup.enter="handleSendEmail">
          <template #prefix>
            <svg-icon icon-class="email" />
          </template>
        </n-input>
        <n-button class="mt-11" color="#ed6ea0" style="width: 100%" :loading="loading" @click="handleSendEmail">
          发送重置链接
        </n-button>
        <div class="mt-10 login-tip">
          <span class="colorFlag" @click="goToLogin">返回登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { AuthAPI } from "@/api/auth";
import { ElMessage } from "element-plus";

const router = useRouter();
const loading = ref(false);
const email = ref("");

const goToLogin = () => {
  router.push('/login');
};

const handleSendEmail = async () => {
    // 表单验证
    if (!email.value.trim()) {
      ElMessage.warning("邮箱不能为空");
      return;
    }
    
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      ElMessage.warning("请输入有效的邮箱地址");
      return;
    }
    
    loading.value = true;
    try {
      // 调用发送重置密码邮件的API
      const response = await AuthAPI.sendEmailVerifyCodeApi({
        email: email.value,
        type: 'reset_password'
      });
      
      if (response.flag) {
        ElMessage.success('重置密码邮件已发送，请查收');
        // 可以显示提示，让用户去邮箱查看
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        ElMessage.error(response.msg || '发送邮件失败');
      }
    } catch (error) {
      console.error('发送重置密码邮件失败:', error);
      ElMessage.error('网络错误，请稍后重试');
    } finally {
      loading.value = false;
    }
  };
</script>

<style scoped>
.forget-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.forget-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.forget-container:hover {
  transform: translateY(-5px);
}

.forget-header {
  text-align: center;
  padding: 40px 20px 20px;
}

.forget-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.subtitle {
  color: #666;
  margin-top: 10px;
  font-size: 14px;
}

.forget-form {
  padding: 0 40px 40px;
}

.login-tip {
  display: flex;
  justify-content: center;
  font-size: 14px;
}

.colorFlag {
  color: #ed6ea0;
  cursor: pointer;
  transition: color 0.3s;
}

.colorFlag:hover {
  color: #d84315;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .forget-container {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .forget-form {
    padding: 0 20px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>