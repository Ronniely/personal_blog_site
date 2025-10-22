/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 为 @kangc/v-md-editor 添加模块声明
declare module '@kangc/v-md-editor/lib/preview' {
  import type { DefineComponent, ComponentPublicInstance } from 'vue';
  
  // 定义 VMdPreview 组件实例的类型
  interface VMdPreviewInstance extends ComponentPublicInstance {
    $el: HTMLElement;
  }
  
  const VMdPreview: DefineComponent<{
    text: string;
    theme?: object;
    beforeChange?: Function;
  }> & {
    use: (theme: any, options?: any) => typeof VMdPreview;
  };
  export default VMdPreview;
  export { VMdPreviewInstance };
}

declare module '@kangc/v-md-editor/lib/theme/vuepress.js' {
  const vuepressTheme: any;
  export default vuepressTheme;
}

declare module '@kangc/v-md-editor/lib/plugins/todo-list/index' {
  const createTodoListPlugin: () => any;
  export default createTodoListPlugin;
}

// 为 prismjs 添加模块声明
declare module 'prismjs' {
  const Prism: any;
  export default Prism;
}

// 为 window 对象添加 $message 属性的类型定义
interface Window {
  $message?: {
    error: (message: string, options?: { duration?: number }) => void;
    success: (message: string, options?: { duration?: number }) => void;
    warning: (message: string, options?: { duration?: number }) => void; // 添加 warning 方法
  }
}


// 为 @/utils/request 添加模块声明
declare module '@/utils/request' {
  import type { AxiosInstance } from 'axios';
  const request: AxiosInstance;
  export default request;
}

// 为 @/utils/token 添加模块声明
declare module '@/utils/token' {
  export function clearStorage(): void;
  export function getToken(): string | null;
  export function setToken(token: string): void;
  export function getUid(): string | null;
  export function setUid(uid: string): void;
  export function getTerminalId(): string | null;
  export function setTerminalId(tid: string): void;
}

// 为 @/api/user 添加模块声明
declare module '@/api/user' {
  import type { 
    DeleteUserBindThirdPartyReq,
    EmptyReq,
    EmptyResp,
    UpdateUserAvatarReq,
    UpdateUserBindEmailReq,
    UpdateUserBindPhoneReq,
    UpdateUserBindThirdPartyReq,
    UpdateUserInfoReq,
    UpdateUserPasswordReq,
    UserInfoResp,
    UserLikeResp,
  } from '@/api/types';
  
  export const UserAPI: {
    /** 删除用户绑定第三方平台账号 */
    deleteUserBindThirdPartyApi(data?: DeleteUserBindThirdPartyReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 获取用户信息 */
    getUserInfoApi(data?: EmptyReq): Promise<IApiResponse<UserInfoResp>>;
    
    /** 获取用户点赞列表 */
    getUserLikeApi(data?: EmptyReq): Promise<IApiResponse<UserLikeResp>>;
    
    /** 修改用户头像 */
    updateUserAvatarApi(data?: UpdateUserAvatarReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 修改用户绑定邮箱 */
    updateUserBindEmailApi(data?: UpdateUserBindEmailReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 修改用户绑定手机号 */
    updateUserBindPhoneApi(data?: UpdateUserBindPhoneReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 修改用户绑定第三方平台账号 */
    updateUserBindThirdPartyApi(data?: UpdateUserBindThirdPartyReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 修改用户信息 */
    updateUserInfoApi(data?: UpdateUserInfoReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 修改用户密码 */
    updateUserPasswordApi(data?: UpdateUserPasswordReq): Promise<IApiResponse<EmptyResp>>;
  };
}

// 为 @/api/auth 添加模块声明
declare module '@/api/auth' {
  import type {
    EmailLoginReq,
    EmptyReq,
    EmptyResp,
    GetCaptchaCodeReq,
    GetCaptchaCodeResp,
    GetOauthAuthorizeUrlReq,
    GetOauthAuthorizeUrlResp,
    GetTouristInfoResp,
    LoginReq,
    LoginResp,
    PhoneLoginReq,
    RegisterReq,
    ResetPasswordReq,
    SendEmailVerifyCodeReq,
    SendPhoneVerifyCodeReq,
    ThirdLoginReq,
  } from '@/api/types';
  
  export const AuthAPI: {
    /** 获取游客身份信息 */
    getTouristInfoApi(data?: EmptyReq): Promise<IApiResponse<GetTouristInfoResp>>;
    
    /** 邮箱登录 */
    emailLoginApi(data?: EmailLoginReq): Promise<IApiResponse<LoginResp>>;
    
    /** 获取验证码 */
    getCaptchaCodeApi(data?: GetCaptchaCodeReq): Promise<IApiResponse<GetCaptchaCodeResp>>;
    
    /** 第三方登录授权地址 */
    getOauthAuthorizeUrlApi(data?: GetOauthAuthorizeUrlReq): Promise<IApiResponse<GetOauthAuthorizeUrlResp>>;
    
    /** 登录 */
    loginApi(data?: LoginReq): Promise<IApiResponse<LoginResp>>;
    
    /** 手机登录 */
    phoneLoginApi(data?: PhoneLoginReq): Promise<IApiResponse<LoginResp>>;
    
    /** 注册 */
    registerApi(data?: RegisterReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 重置密码 */
    resetPasswordApi(data?: ResetPasswordReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 发送邮件验证码 */
    sendEmailVerifyCodeApi(data?: SendEmailVerifyCodeReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 发送手机验证码 */
    sendPhoneVerifyCodeApi(data?: SendPhoneVerifyCodeReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 第三方登录 */
    thirdLoginApi(data?: ThirdLoginReq): Promise<IApiResponse<LoginResp>>;
    
    /** 注销 */
    logoffApi(data?: EmptyReq): Promise<IApiResponse<EmptyResp>>;
    
    /** 登出 */
    logoutApi(data?: EmptyReq): Promise<IApiResponse<EmptyResp>>;
  };
}

// 为 @/api/types 添加模块声明
declare module '@/api/types' {
  export interface Album {
    id: number;
    album_name: string;
    album_desc: string;
    album_cover: string;
  }
  
  export interface AlbumQueryReq extends PageQuery {}
  
  export interface ArticleArchivesQueryReq extends PageQuery {}
  
  export interface ArticleClassifyQueryReq extends PageQuery {
    classify_name?: string;
  }
  
  export interface ArticleDetails extends ArticleHome {
    author?: UserInfoVO;
    last_article?: ArticlePreview;
    next_article?: ArticlePreview;
    recommend_article_list: ArticlePreview[];
    newest_article_list: ArticlePreview[];
  }
  
  export interface ArticleHome {
    id: number;
    article_cover: string;
    article_title: string;
    article_content: string;
    article_type: number;
    original_url: string;
    is_top: number;
    status: number;
    created_at: number;
    updated_at: number;
    category_name: string;
    tag_name_list: string[];
    like_count: number;
    views_count: number;
  }
  
  export interface ArticleHomeQueryReq extends PageQuery {
    article_title?: string;
  }
  
  export interface ArticlePreview {
    id: number;
    article_cover: string;
    article_title: string;
    like_count: number;
    views_count: number;
    created_at: number;
  }
  
  export interface BatchResp {
    success_count: number;
  }
  
  export interface Category {
    id: number;
    category_name: string;
    article_count: number;
    created_at: number;
    updated_at: number;
  }
  
  export interface CategoryQueryReq extends PageQuery {
    category_name?: string;
  }
  
  export interface ChatMessageEvent {
    id: number;
    user_id: string;
    terminal_id: string;
    nickname: string;
    avatar: string;
    ip_address: string;
    ip_source: string;
    type: string;
    content: string;
    status: number;
    created_at: number;
    updated_at: number;
  }
  
  export interface ClientInfoEvent {
    ip_address: string;
    ip_source: string;
  }
  
  export interface Comment {
    id: number;
    topic_id: number;
    parent_id: number;
    reply_msg_id: number;
    user_id: string;
    reply_user_id: string;
    comment_content: string;
    type: number;
    created_at: number;
    like_count: number;
    user?: UserInfoVO;
    reply_user?: UserInfoVO;
    reply_count: number;
    comment_reply_list: CommentReply[];
  }
  
  export interface CommentNewReq {
    topic_id?: number;
    parent_id?: number;
    reply_msg_id?: number;
    reply_user_id?: string;
    comment_content: string;
    type: number;
    status?: number;
  }
  
  export interface CommentQueryReq extends PageQuery {
    topic_id?: number;
    parent_id?: number;
    type?: number;
  }
  
  export interface CommentReply {
    id: number;
    topic_id: number;
    parent_id: number;
    reply_msg_id: number;
    user_id: string;
    reply_user_id: string;
    comment_content: string;
    type: number;
    created_at: number;
    like_count: number;
    user?: UserInfoVO;
    reply_user?: UserInfoVO;
  }
  
  export interface DeleteUserBindThirdPartyReq {
    platform: string;
  }
  
  export interface DeletesUploadFileReq {
    file_paths?: string[];
  }
  
  export interface EmailLoginReq {
    email: string;
    password: string;
    captcha_key?: string;
    captcha_code?: string;
  }
  
  export interface EmptyReq {}
  
  export interface EmptyResp {}
  
  export interface FileInfoVO {
    file_path: string;
    file_name: string;
    file_type: string;
    file_size: number;
    file_url: string;
    updated_at: number;
  }
  
  export interface Friend {
    id: number;
    link_name: string;
    link_avatar: string;
    link_address: string;
    link_intro: string;
    created_at: number;
    updated_at: number;
  }
  
  export interface FriendQueryReq extends PageQuery {}
  
  export interface GetAboutMeReq {}
  
  export interface GetAboutMeResp {
    content: string;
  }
  
  export interface GetBlogHomeInfoReq {}
  
  export interface GetBlogHomeInfoResp {
    article_count: number;
    category_count: number;
    tag_count: number;
    total_user_view_count: number;
    total_page_view_count: number;
    page_list: PageVO[];
    website_config: WebsiteConfigVO;
  }
  
  export interface GetCaptchaCodeReq {
    width?: number;
    height?: number;
  }
  
  export interface GetCaptchaCodeResp {
    captcha_key: string;
    captcha_base64: string;
    captcha_code: string;
  }
  
  export interface GetOauthAuthorizeUrlReq {
    platform: string;
    state?: string;
  }
  
  export interface GetOauthAuthorizeUrlResp {
    authorize_url: string;
  }
  
  export interface GetTouristInfoResp {
    tourist_id: string;
  }
  
  export interface HistoryMessageEvent {
    list: ChatMessageEvent[];
  }
  
  export interface IdReq {
    id: number;
  }
  
  export interface IdsReq {
    ids: number[];
  }
  
  export interface ListUploadFileReq {
    file_path?: string;
    limit?: number;
  }
  
  export interface LoginReq {
    username: string;
    password: string;
    captcha_key?: string;
    captcha_code?: string;
  }
  
  export interface LoginResp {
    token?: Token;
  }
  
  export interface MessageEvent {
    type: number;
    data: string;
    timestamp: number;
  }
  
  export interface MultiUploadFileReq {
    files?: any[];
    file_path?: string;
  }
  
  export interface OnlineEvent {
    count: number;
    is_online: boolean;
    msg: string;
  }
  
  export interface Page {
    id: number;
    page_name: string;
    page_label: string;
    page_cover: string;
    is_carousel?: number;
    created_at: number;
    updated_at: number;
  }
  
  export interface PageQuery {
    page?: number;
    page_size?: number;
    sorts?: string[];
  }
  
  export interface PageQueryReq extends PageQuery {}
  
  export interface PageResp {
    page: number;
    page_size: number;
    total: number;
    list: any;
  }
  
  export interface PageVO {
    id: number;
    page_name: string;
    page_label: string;
    page_cover: string;
    is_carousel?: number;
  }
  
  export interface PhoneLoginReq {
    phone: string;
    verify_code: string;
  }
  
  export interface Photo {
    id: number;
    photo_url: string;
  }
  
  export interface PhotoQueryReq {
    album_id: number;
  }
  
  export interface PingReq {}
  
  export interface PingResp {
    env: string;
    name: string;
    version: string;
    runtime: string;
    description: string;
    rpc_status: string[];
  }
  
  export interface RecallMessageEvent {
    id: number;
  }
  
  export interface RegisterReq {
    username: string;
    password: string;
    confirm_password: string;
    email: string;
    verify_code: string;
  }
  
  export interface Remark {
    id?: number;
    user_id: string;
    terminal_id: string;
    message_content: string;
    ip_address: string;
    ip_source: string;
    is_review: number;
    created_at: number;
    updated_at: number;
    user?: UserInfoVO;
  }
  
  export interface RemarkNewReq {
    message_content: string;
  }
  
  export interface RemarkQueryReq extends PageQuery {}
  
  export interface ResetPasswordReq {
    password: string;
    confirm_password: string;
    email: string;
    verify_code: string;
  }
  
  export interface Response {
    code: number;
    msg: string;
    data: any;
    trace_id: string;
  }
  
  export interface RestHeader {
    header_country?: string;
    header_language?: string;
    header_timezone?: string;
    header_app_name?: string;
    header_timestamp?: string;
    header_terminal_id?: string;
    header_x_ts_token?: string;
    header_uid?: string;
    header_token?: string;
    header_authorization?: string;
  }
  
  export interface RewardQrCode {
    alipay_qr_code: string;
    weixin_qr_code: string;
  }
  
  export interface SendEmailVerifyCodeReq {
    email: string;
    type: string;
  }
  
  export interface SendPhoneVerifyCodeReq {
    phone: string;
    type: string;
  }
  
  export interface SocialAccountInfo {
    name: string;
    platform: string;
    link_url: string;
    enabled: boolean;
  }
  
  export interface Tag {
    id: number;
    tag_name: string;
    article_count: number;
    created_at: number;
    updated_at: number;
  }
  
  export interface TagQueryReq extends PageQuery {
    tag_name?: string;
  }
  
  export interface Talk {
    id: number;
    user_id: string;
    content: string;
    img_list: string[];
    is_top: number;
    status: number;
    like_count: number;
    comment_count: number;
    created_at: number;
    updated_at: number;
    user?: UserInfoVO;
  }
  
  export interface TalkQueryReq extends PageQuery {}
  
  export interface ThirdLoginReq {
    platform: string;
    code?: string;
  }
  
  export interface ThirdPlatformInfo {
    name: string;
    platform: string;
    authorize_url: string;
    enabled: boolean;
  }
  
  export interface Token {
    user_id: string;
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
    scope: string;
  }
  
  export interface UpdateCommentReq {
    id: number;
    reply_user_id?: string;
    comment_content: string;
    status?: number;
  }
  
  export interface UpdateUserAvatarReq {
    avatar: string;
  }
  
  export interface UpdateUserBindEmailReq {
    email: string;
    verify_code: string;
  }
  
  export interface UpdateUserBindPhoneReq {
    phone: string;
    verify_code: string;
  }
  
  export interface UpdateUserBindThirdPartyReq {
    platform: string;
    code: string;
    state?: string;
  }
  
  export interface UpdateUserInfoReq extends UserInfoExt {
    nickname: string;
  }
  
  export interface UpdateUserPasswordReq {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }
  
  export interface UploadFileReq {
    file?: any;
    file_path?: string;
  }
  
  export interface UserInfoExt {
    gender?: number;
    intro?: string;
    website?: string;
  }
  
  export interface UserInfoResp extends UserInfoExt {
    user_id: string;
    username: string;
    nickname: string;
    avatar: string;
    email: string;
    phone: string;
    register_type: string;
    created_at: number;
    third_party: UserThirdPartyInfo[];
  }
  
  export interface UserInfoVO extends UserInfoExt {
    user_id: string;
    username: string;
    avatar: string;
    nickname: string;
  }
  
  export interface UserLikeResp {
    article_like_set: number[];
    comment_like_set: number[];
    talk_like_set: number[];
  }
  
  export interface UserThirdPartyInfo {
    platform: string;
    open_id: string;
    nickname: string;
    avatar: string;
    created_at: number;
  }
  
  export interface WebsiteConfigVO {
    admin_url: string;
    websocket_url: string;
    tourist_avatar: string;
    user_avatar: string;
    website_feature?: WebsiteFeature;
    website_info?: WebsiteInfo;
    reward_qr_code?: RewardQrCode;
    social_login_list: ThirdPlatformInfo[];
    social_url_list: SocialAccountInfo[];
  }
  
  export interface WebsiteFeature {
    is_chat_room: number;
    is_comment_review: number;
    is_email_notice: number;
    is_message_review: number;
    is_music_player: number;
    is_reward: number;
  }
  
  export interface WebsiteInfo {
    website_author: string;
    website_avatar: string;
    website_create_time: string;
    website_intro: string;
    website_name: string;
    website_notice: string;
    website_record_no: string;
  }
}

// 为 @/store 添加模块声明
declare module '@/store' {
  import { useAppStore } from '@/store/modules/app';
  import { useBlogStore } from '@/store/modules/blog';
  import { useUserStore } from '@/store/modules/user';
  
  export { useAppStore, useBlogStore, useUserStore };
  export function setupStore(app: any): void;
}

// 为 @/types/api 添加模块声明
declare module '@/types/api' {
  /** 所有 api 接口的响应数据都应该准守该格式 */
  export interface IApiResponse<T> {
    flag: boolean;
    code: number;
    data: T;
    msg: string;
    trace_id: string;
  }

  export interface PageResult<T> {
    list: T;
    page: number;
    page_size: number;
    total: number;
  }

  export interface PageQuery {
    page?: number;
    page_size?: number;
    sorts?: Sort[];
    conditions?: Condition[];
  }

  export interface Sort {
    field: string;
    order: string;
  }

  export interface Condition {
    field: string;
    value?: any;
    logic?: "and" | "or" | string;
    operator?: "like" | "=" | ">" | "<" | string;
  }
}

// 为 pinia 添加类型声明
declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | PersistOptions;
  }
  
  export interface PersistOptions {
    key?: string;
    storage?: Storage;
  }
  
  export function defineStore(id: string, options: any): any;
  
  export type Store<State, Getters, Actions> = State & Getters & Actions;
}

// 为 v-viewer 添加模块声明
declare module 'v-viewer' {
  import type { Plugin } from 'vue';
  const VueViewer: Plugin;
  export default VueViewer;
}

// 为 vue3-lazy 添加模块声明
declare module 'vue3-lazy' {
  import type { Plugin } from 'vue';
  const lazyPlugin: Plugin;
  export default lazyPlugin;
}
