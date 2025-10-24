import type { GetBlogHomeInfoResp, WebsiteConfigVO } from "@/api/types";
import { WebsiteAPI } from "@/api/website.ts";
import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import type { IApiResponse } from "@/types/api";

/**
 * 博客
 */
interface BlogState {
  /**
   * 博客信息
   */
  blogInfo: GetBlogHomeInfoResp;
}

export const useBlogStore = defineStore("useBlogStore", () => {
  const state = reactive<BlogState>({
    blogInfo: {
      article_count: 0,
      category_count: 0,
      tag_count: 0,
      total_user_view_count: 0,
      total_page_view_count: 0,
      page_list: [],
      website_config: {
        admin_url: "",
        websocket_url: "",
        tourist_avatar: "",
        user_avatar: "",
        website_feature: {
          is_chat_room: 0,
          is_comment_review: 0,
          is_email_notice: 0,
          is_message_review: 0,
          is_music_player: 0,
          is_reward: 0,
        },
        social_login_list: [],
        social_url_list: [],
      } as WebsiteConfigVO,
    } as GetBlogHomeInfoResp,
  });

  const getBlogInfo = (): Promise<IApiResponse<GetBlogHomeInfoResp>> => {
    return new Promise((resolve, reject) => {
      WebsiteAPI.getBlogHomeInfoApi()
        .then((res) => {
          state.blogInfo = res.data;
          resolve(res);
        })
        .catch((error) => {
          console.error("获取博客信息失败:", error);
          reject(error);
        });
    });
  };

  const getCover = (page: string): string => {
    const cover = state.blogInfo.page_list.find(
      (item: any) => item.page_label === page
    )?.page_cover;
    return cover ? cover : "https://static.veweiyi.cn/blog/cover/zhuque.jpg";
  };

  const getCarouselList = (): string[] => {
    if (state.blogInfo.page_list.length == 0) {
      return [
        "https://static.veweiyi.cn/blog/cover/qinglong.jpg",
        "https://static.veweiyi.cn/blog/cover/baihu.jpg",
        "https://static.veweiyi.cn/blog/cover/zhuque.jpg",
        "https://static.veweiyi.cn/blog/cover/xuanwu.jpg",
        "https://static.veweiyi.cn/blog/cover/qilin.jpg",
        "https://static.veweiyi.cn/blog/cover/wusheng.jpg",
      ];
    }

    return state.blogInfo.page_list
      .filter((item) => item.is_carousel === 1)
      .map((item) => {
        return item.page_cover;
      });
  };

  return {
    ...toRefs(state),
    getBlogInfo,
    getCover,
    getCarouselList,
  };
});