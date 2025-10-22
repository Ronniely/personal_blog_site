import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";

interface AppState {
  /** 侧边栏展开 */
  isCollapse: boolean;
  /** 搜索框 */
  searchFlag: boolean;
  /** 登录框 */
  loginFlag: boolean;
  /** 注册框 */
  registerFlag: boolean;
  /** 忘记密码框 */
  forgetFlag: boolean;
  /** 邮箱登录弹框 */
  emailLoginFlag: boolean;
  /** 手机登录弹框 */
  phoneLoginFlag: boolean;
  /** 邮箱绑定弹框 */
  emailBindFlag: boolean;
  /** 手机号绑定弹框 */
  phoneBindFlag: boolean;
  /** 第三方账号绑定弹框 */
  thirdBindFlag: boolean;

  /** 左侧展开 */
  sideFlag: boolean;
}

export const useAppStore = defineStore("useAppStore", () => {
  const state = reactive<AppState>({
    isCollapse: false,
    searchFlag: false,
    loginFlag: false,
    registerFlag: false,
    forgetFlag: false,
    emailLoginFlag: false,
    phoneLoginFlag: false,
    emailBindFlag: false,
    phoneBindFlag: false,
    thirdBindFlag: false,
    sideFlag: false,
  });

  const setCollapse = (flag: boolean) => {
    state.isCollapse = flag;
  };

  const setLoginFlag = (flag: boolean) => {
    state.loginFlag = flag;
  };

  const setRegisterFlag = (flag: boolean) => {
    state.registerFlag = flag;
  };

  const setForgetFlag = (flag: boolean) => {
    state.forgetFlag = flag;
  };

  const setEmailLoginFlag = (flag: boolean) => {
    state.emailLoginFlag = flag;
  };

  const setPhoneLoginFlag = (flag: boolean) => {
    state.phoneLoginFlag = flag;
  };

  const setEmailBindFlag = (flag: boolean) => {
    state.emailBindFlag = flag;
  };

  const setPhoneBindFlag = (flag: boolean) => {
    state.phoneBindFlag = flag;
  };

  return {
    ...toRefs(state),
    setCollapse,
    setLoginFlag,
    setRegisterFlag,
    setForgetFlag,
    setEmailLoginFlag,
    setPhoneLoginFlag,
    setEmailBindFlag,
    setPhoneBindFlag,
  };
});