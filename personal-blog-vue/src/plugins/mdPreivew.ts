import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';

// 数学公式解析,根据需要决定是否启用
// import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';

// Vue 3 兼容导入方式
declare module 'vue' {
  interface GlobalComponents {
    VMdPreview: typeof VMdPreview
  }
}

import type { App } from 'vue';

export default async function setupMdPreview(app: App) {
  // 动态导入 prismjs
  const { default: Prism } = await import('prismjs');
  
  // 在Vue 3中，使用组件注册而非插件方式
  VMdPreview.use(vuepressTheme, {
    Prism,
  }).use(createTodoListPlugin());
  // .use(createKatexPlugin());
  
  // 注册为全局组件
  app.component('VMdPreview', VMdPreview);
}