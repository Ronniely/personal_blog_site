import * as pinia from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import type { App } from "vue";
import { resetSetupStore } from "./plugins";

// 导入各个模块的 store
export { useAppStore } from "./modules/app";
export { useBlogStore } from "./modules/blog";
export { useUserStore } from "./modules/user";

/** setup vue store plugin: pinia. - [安装vue状态管理插件：pinia] */
export function setupStore(app: App) {
  const store = (pinia as any).createPinia();
  store.use(resetSetupStore);
  store.use(piniaPluginPersistedState);
  app.use(store);
}

export * from "./modules";
