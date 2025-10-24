<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h2>创建账号</h2>
        <p class="subtitle">注册后即可使用所有功能</p>
      </div>
      <div class="register-form">
        <n-input v-model:value="registerForm.username" class="mt-11" placeholder="用户名" @keyup.enter="handleRegister">
          <template #prefix>
            <svg-icon icon-class="user" />
          </template>
        </n-input>
        <n-input v-model:value="registerForm.email" class="mt-11" placeholder="邮箱" @keyup.enter="handleRegister">
          <template #prefix>
            <svg-icon icon-class="email" />
          </template>
        </n-input>
        <n-input v-model:value="registerForm.password" class="mt-11" type="password" show-password-on="click" placeholder="密码"
          @keyup.enter="handleRegister">
          <template #prefix>
            <svg-icon icon-class="lock" />
          </template>
        </n-input>
        <n-input v-model:value="registerForm.confirm_password" class="mt-11" type="password" show-password-on="click" placeholder="确认密码"
          @keyup.enter="handleRegister">
          <template #prefix>
            <svg-icon icon-class="lock" />
          </template>
        </n-input>
        <div class="mt-11 flex gap-3">
          <n-input v-model:value="registerForm.verify_code" placeholder="验证码" @keyup.enter="handleRegister" style="flex: 1;">
            <template #prefix>
              <svg-icon icon-class="code" />
            </template>
          </n-input>
          <n-button type="primary" :disabled="countdown > 0" @click="sendVerifyCode" style="width: 120px;">
            {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
          </n-button>
        </div>
        <n-button class="mt-11" color="#ed6ea0" style="width: 100%" :loading="loading" @click="handleRegister">
          注 册
        </n-button>
        <div class="mt-10 login-tip">
          <span class="colorFlag" @click="goToLogin">已有账号？立即登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store";
import { AuthAPI } from "@/api/auth";
import type { RegisterReq } from "@/api/types";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const countdown = ref(0);
const registerForm = ref<RegisterReq>({
  username: "",
  email: "",
  password: "",
  confirm_password: "",
  verify_code: "",
});

const goToLogin = () => {
  router.push('/login');
};

const handleRegister = async () => {
  // 表单验证
  if (!registerForm.value.username.trim()) {
    ElMessage.warning("用户名不能为空");
    return;
  }
  if (!registerForm.value.email.trim()) {
    ElMessage.warning("邮箱不能为空");
    return;
  }
  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(registerForm.value.email)) {
    ElMessage.warning("请输入有效的邮箱地址");
    return;
  }
  if (!registerForm.value.password.trim()) {
    ElMessage.warning("密码不能为空");
    return;
  }
  if (registerForm.value.password.length < 6) {
    ElMessage.warning("密码长度至少为6位");
    return;
  }
  if (registerForm.value.password !== registerForm.value.confirm_password) {
    ElMessage.warning("两次输入的密码不一致");
    return;
  }
  if (!registerForm.value.verify_code.trim()) {
    ElMessage.warning("请输入验证码");
    return;
  }
  
  loading.value = true;
  try {
    const res = await userStore.register(registerForm.value);
    if (res && res.flag) {
      ElMessage.success("注册成功，请登录");
      // 注册成功后跳转到登录页面
      router.push('/login');
    } else {
      ElMessage.error(res?.msg || "注册失败");
    }
  } catch (error) {
    ElMessage.error("注册失败，请重试");
  } finally {
    loading.value = false;
  }
};

const sendVerifyCode = async () => {
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!registerForm.value.email.trim() || !emailRegex.test(registerForm.value.email)) {
    ElMessage.warning("请输入有效的邮箱地址");
    return;
  }
  
  try {
    const res = await AuthAPI.sendEmailVerifyCodeApi({
      email: registerForm.value.email,
      type: 'register'
    });
    
    if (res.flag) {
      ElMessage.success("验证码已发送，请查收");
      // 开始倒计时
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      ElMessage.error(res.msg || "发送失败");
    }
  } catch (error) {
    ElMessage.error("发送失败，请重试");
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.register-container:hover {
  transform: translateY(-5px);
}

.register-header {
  text-align: center;
  padding: 40px 20px 20px;
}

.register-header h2 {
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

.register-form {
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
  .register-container {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .register-form {
    padding: 0 20px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>