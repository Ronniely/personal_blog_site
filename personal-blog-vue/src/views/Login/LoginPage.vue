<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2>欢迎登录</h2>
        <p class="subtitle">登录后享受更多功能</p>
      </div>
      <div class="login-form">
        <n-input v-model:value="loginForm.username" class="mt-11" placeholder="邮箱号" @keyup.enter="handleLogin">
          <template #prefix>
            <svg-icon icon-class="email" />
          </template>
        </n-input>
        <n-input v-model:value="loginForm.password" class="mt-11" type="password" show-password-on="click" placeholder="密码"
          @keyup.enter="handleLogin">
          <template #prefix>
            <svg-icon icon-class="lock" />
          </template>
        </n-input>
        <n-button class="mt-11" color="#ed6ea0" style="width: 100%" :loading="loading" @click="handleLogin">
          登 录
        </n-button>
        <div class="mt-10 login-tip">
          <span class="colorFlag" @click="handleRegister">立即注册</span>
          <span class="colorFlag" @click="handleForget">忘记密码?</span>
        </div>
        <div class="social-login-section">
          <div class="social-login-title">社交账号登录</div>
          <div class="social-login-wrapper">
            <template v-for="item in thirdPlatformList" :key="item.platform">
              <svg-icon v-if="item.enabled" class="icon" :icon-class="item.platform" size="2rem"
                @click="oauthLogin(item.platform)" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore, useBlogStore, useUserStore } from "@/store/index";
import { AuthAPI } from "@/api/auth";
import type { GetOauthAuthorizeUrlReq, LoginReq } from "@/api/types";
import { ElMessage } from "element-plus";

const appStore = useAppStore();
const userStore = useUserStore();
const blogStore = useBlogStore();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const loginForm = ref<LoginReq>({
  username: "",
  password: "",
});

// 获取第三方登录平台列表
const thirdPlatformList = ref<any[]>([]);

onMounted(() => {
  // 初始化第三方登录平台列表
  if (blogStore.blogInfo?.website_config?.social_login_list) {
    thirdPlatformList.value = blogStore.blogInfo.website_config.social_login_list;
  }
});

const handleRegister = () => {
  // 跳转到注册页面
  router.push('/register');
};

const handleForget = () => {
  // 跳转到忘记密码页面
  router.push('/forget-password');
};

const oauthLogin = (platform: string) => {
  const oauth: GetOauthAuthorizeUrlReq = {
    platform: platform,
    state: route.path,
  };
  AuthAPI.getOauthAuthorizeUrlApi(oauth).then((res) => {
    console.log(res.data.authorize_url);
    window.location.href = res.data.authorize_url;
  });
};

const handleLogin = async () => {
  if (loginForm.value.username.trim().length === 0) {
    ElMessage.warning("用户名最小长度是6");
    return;
  }
  if (loginForm.value.password.trim().length === 0) {
    ElMessage.warning("密码不能为空");
    return;
  }
  
  loading.value = true;
  try {
    const res = await userStore.login(loginForm.value);
    if (res && res.code === 200) {
      ElMessage.success("登录成功");
      
      // 获取用户信息
      await userStore.getUserInfo();
      
      // 检查邮箱是否为空
      if (userStore.userInfo.email === "") {
        ElMessage.warning("请绑定邮箱以便及时收到回复");
      }
      
      // 跳转到首页或来源页面
      const redirectPath = route.query.redirect || "/";
      router.push(redirectPath as string);
    } else {
      ElMessage.error(res?.message || "登录失败");
    }
  } catch (error) {
    ElMessage.error("登录失败，请重试");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.login-container:hover {
  transform: translateY(-5px);
}

.login-header {
  text-align: center;
  padding: 40px 20px 20px;
}

.login-header h2 {
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

.login-form {
  padding: 0 40px 40px;
}

.login-tip {
  display: flex;
  justify-content: space-between;
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

.social-login-section {
  margin-top: 30px;
}

.social-login-title {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
  position: relative;
}

.social-login-title::before,
.social-login-title::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #e0e0e0;
}

.social-login-title::before {
  left: 0;
}

.social-login-title::after {
  right: 0;
}

.social-login-wrapper {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.icon {
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
}

.icon:hover {
  transform: scale(1.2);
  color: #ed6ea0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .login-form {
    padding: 0 20px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>