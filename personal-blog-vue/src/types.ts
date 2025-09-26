// 作者信息接口
export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
}

// 文章接口
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: { id: string; name: string };
  tags: { id: string; name: string }[];
  excerpt: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  author: Author;
  comments?: Comment[];
}

// 分类接口
export interface Category {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

// 标签接口
export interface Tag {
  id: string;
  name: string;
  count?: number;
}

// 评论接口
export interface Comment {
  id: string;
  postId: string;
  author: { id: string; name: string; avatar?: string };
  content: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

// 扩展BlogPost接口，添加comments属性
export interface BlogPostWithComments extends BlogPost {
  comments?: Comment[];
}