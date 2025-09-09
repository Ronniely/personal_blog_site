// 博客文章类型
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  coverImage?: string;
  author: Author;
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  count: number;
}

// 作者信息类型
export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  socialLinks?: SocialLink[];
}

// 社交链接类型
export interface SocialLink {
  platform: string;
  url: string;
}

// 评论类型
export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  avatar?: string;
  replies?: Comment[];
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  count: number;
}