<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- 左侧：个人博客信息 -->
        <div class="footer-left">
          <h3 class="footer-logo">个人博客</h3>
          <p class="footer-description">
            分享技术知识和个人经验，希望为你带来有价值的内容。
          </p>
        </div>
        
        <!-- 中间：快速链接 -->
        <div class="footer-center">
          <h4 class="footer-title">快速链接</h4>
          <ul class="links-list">
            <li>
              <router-link to="/" class="footer-link">首页</router-link>
            </li>
            <li>
              <router-link to="/categories" class="footer-link">分类</router-link>
            </li>
            <li>
              <router-link to="/tags" class="footer-link">标签</router-link>
            </li>
          </ul>
        </div>
        
        <!-- 右侧：订阅 -->
        <div class="footer-right">
          <h4 class="footer-title">订阅更新</h4>
          <p class="subscription-text">订阅我的博客，获取最新技术和信息</p>
          <div class="subscription-form">
            <input type="email" placeholder="您的邮箱地址" class="subscription-input" />
            <button type="button" class="subscription-button">订阅</button>
          </div>
        </div>
      </div>
      
      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} 个人博客. 保留所有权利.
        </p>
        <div class="footer-policies">
          <a href="#" class="policy-link">隐私政策</a>
          <span class="separator">|</span>
          <a href="#" class="policy-link">使用条款</a>
          <span class="separator">|</span>
          <a href="#" class="policy-link">网站地图</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const currentYear = ref<number>(new Date().getFullYear());
</script>

<style scoped>
.footer {
  background-color: #1a1a1a;
  color: #fff;
  padding: 3rem 0;
  margin-top: 4rem;
  border-top: 1px solid #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }
}

/* 左侧区域 */
.footer-left .footer-logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #fff;
}

.footer-description {
  color: #888;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* 中间区域 */
.footer-center {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.links-list li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: #888;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #4a90e2;
}

/* 右侧区域 */
.footer-right {
  display: flex;
  flex-direction: column;
}

.subscription-text {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.subscription-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.subscription-input {
  padding: 0.75rem 1rem;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.subscription-input:focus {
  border-color: #4a90e2;
}

.subscription-input::placeholder {
  color: #666;
}

.subscription-button {
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.subscription-button:hover {
  background-color: #357abd;
}

/* 底部区域 */
.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.copyright {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.footer-policies {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
}

.policy-link {
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
}

.policy-link:hover {
  color: #4a90e2;
}

.separator {
  color: #444;
}

/* 响应式调整 */
@media (max-width: 767px) {
  .footer {
    padding: 2rem 0;
  }
  
  .footer-content {
    gap: 1.5rem;
  }
  
  .footer-bottom {
    padding-top: 1.5rem;
  }
  
  .footer-policies {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>