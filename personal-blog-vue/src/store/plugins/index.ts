import { cloneDeep } from "lodash-es";
import type { App } from "vue";

/**
 * reset store - [重置store]。
 */
export function resetSetupStore(context: any) {
  const setupSyntaxIds = ["setup-store"];

  if (setupSyntaxIds.includes(context.store.$id)) {
    const { $state } = context.store;

    const defaultStore = cloneDeep($state);

    context.store.$reset = () => {
      context.store.$patch(defaultStore);
    };
  }
}
