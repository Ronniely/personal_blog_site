<template>
  <!--背景轮播-->
  <Images></Images>
  <!-- 品牌 -->
  <Brand></Brand>
  <div class="bg">
    <div class="main-container mt">
      <div class="left-container" :class="appStore.sideFlag ? 'test' : ''">
        <!-- 说说 -->
        <TalkSwiper></TalkSwiper>
        <!-- 推荐文章 -->
        <Recommend></Recommend>
        <!-- 文章列表 -->
        <ArticleItem></ArticleItem>
      </div>
      <div class="right-container" :class="appStore.sideFlag ? 'temp' : ''">
        <SideBar></SideBar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useBlogStore } from "@/store";
import ArticleItem from "@/views/Article/ArticleItem.vue";
import Brand from "./Brand/index.vue";
import Images from "./Swiper/Images.vue";
import Recommend from "./Swiper/Recommend.vue";
import TalkSwiper from "./Swiper/TalkSwiper.vue";
import SideBar from "@/components/Layout/SideBar/index.vue";

const appStore = useAppStore();
const blogStore = useBlogStore();
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixin.scss" as *;
@use "@/assets/styles/common.scss" as *;

.mt {
  margin-top: 1rem;
  padding-bottom: 1.75rem;
}

// 确保首页内容不会被固定定位的元素遮挡
:deep(.main-container) {
  position: relative;
  z-index: 1;
}
</style>