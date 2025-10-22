<template>
  <div>
    <!-- 作者信息 -->
    <div class="author-container">
      <!-- 作者头像 -->
      <img v-if="blogStore.blogInfo.website_config?.website_info" class="author-avatar"
        :src="blogStore.blogInfo.website_config.website_info.website_avatar" />
      <!-- 作者名称 -->
      <p v-if="blogStore.blogInfo.website_config?.website_info" class="author-name">{{
        blogStore.blogInfo.website_config.website_info.website_author }}</p>
      <!-- 网站简介 -->
      <div v-if="blogStore.blogInfo.website_config?.website_info" class="site-desc">
        {{ blogStore.blogInfo.website_config.website_info.website_intro }}
      </div>
    </div>
    <!-- 博客信息 -->
    <blog-info></blog-info>
    <!-- 社交 -->
    <social-list></social-list>
  </div>
</template>

<script setup lang="ts">
import { useBlogStore } from "@/store";
import BlogInfo from "./BlogInfo.vue";
import SocialList from "./SocialList.vue";

const blogStore = useBlogStore();
</script>

<style scoped></style>