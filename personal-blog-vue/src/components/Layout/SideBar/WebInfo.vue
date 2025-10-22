<template>
  <div>
    <div class="web-title">
      <svg-icon icon-class="web" size="1.1875rem"></svg-icon>
      网站资讯
    </div>
    <div v-for="(item, index) in webInfo" :key="index" class="web-item">
      <div class="web-name">{{ item.name }}</div>
      <div class="web-count">{{ item.count }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useBlogStore } from "@/store";

const blogStore = useBlogStore();
const runTime = ref("");
let timer: number | null = null;

// 安全地计算运行时间
const calculateRunTime = () => {
  // 检查 website_info 是否存在
  if (!blogStore.blogInfo.website_config?.website_info?.website_create_time) {
    runTime.value = "未知";
    return;
  }

  const day = new Date();
  const createTime = new Date(blogStore.blogInfo.website_config.website_info.website_create_time);

  // 检查创建时间是否有效
  if (isNaN(createTime.getTime())) {
    runTime.value = "未知";
    return;
  }

  const diffTime = day.getTime() - createTime.getTime();
  const days = Math.floor(diffTime / (24 * 60 * 60 * 1000));
  let str = "";
  str += days + "天";
  str += day.getHours() + "时";
  str += day.getMinutes() + "分";
  str += day.getSeconds() + "秒";
  runTime.value = str;
};

// 组件挂载时启动定时器
onMounted(() => {
  calculateRunTime(); // 立即计算一次
  timer = window.setInterval(calculateRunTime, 1000);
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const webInfo = computed(() => {
  return [
    { name: "总访问量", count: blogStore.blogInfo.total_page_view_count },
    { name: "文章数目", count: blogStore.blogInfo.article_count },
    { name: "运行时长", count: runTime.value },
  ];
});
</script>

<style lang="scss" scoped>
.web-title {
  font-size: 1.2em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.web-item {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}
</style>