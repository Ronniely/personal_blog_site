import { BlogPost, Author, Category, Tag } from '../types';
import dayjs from 'dayjs';

// 模拟作者数据
const author: Author = {
  id: '1',
  name: '黄文杰',
  avatar: 'https://via.placeholder.com/150',
  bio: '热爱技术和分享的开发者，专注于前端技术、编程思想和个人成长。',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com' },
    { platform: 'Twitter', url: 'https://twitter.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' }
  ]
};

// 模拟分类数据
export const categories: Category[] = [
  { id: '1', name: '技术分享', count: 12 },
  { id: '2', name: '前端开发', count: 8 },
  { id: '3', name: '后端开发', count: 6 },
  { id: '4', name: '工具推荐', count: 5 },
  { id: '5', name: '职业成长', count: 7 }
];

// 模拟标签数据
export const tags: Tag[] = [
  { id: '1', name: 'JavaScript', count: 15 },
  { id: '2', name: 'React', count: 10 },
  { id: '3', name: 'Node.js', count: 8 },
  { id: '4', name: 'TypeScript', count: 9 },
  { id: '5', name: 'CSS', count: 6 },
  { id: '6', name: '性能优化', count: 4 },
  { id: '7', name: '架构设计', count: 5 }
];

// 生成随机日期
const generateRandomDate = (daysBack: number = 365): string => {
  const today = dayjs();
  const randomDays = Math.floor(Math.random() * daysBack);
  return today.subtract(randomDays, 'day').format('YYYY-MM-DD');
};

// 模拟博客文章数据
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'React 18 新特性全面解析',
    content: `## React 18 带来的革命性变化

React 18 引入了许多令人兴奋的新特性，包括自动批处理、Transition API、Suspense on the server等。这些特性不仅提高了应用程序的性能，还简化了开发者的工作流程。

### 自动批处理

自动批处理使React能够将多个状态更新合并为一个重新渲染，从而提高性能。在React 18之前，只有在React事件处理程序中的更新才会被批处理，而现在即使在Promise、setTimeout或原生事件处理程序中的更新也会被批处理。

### Transition API

Transition API允许开发者区分紧急和非紧急更新，为用户提供更流畅的体验。

\`\`\`javascript
import { startTransition } from 'react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    startTransition(() => {
      // 这个更新被标记为非紧急
      setResults(getSearchResults(query));
    });
  };
}
\`\`\`

### Suspense on the server

React 18允许在服务器端渲染中使用Suspense，这使得在等待数据时可以显示占位符，提高了用户体验。

总的来说，React 18通过这些新特性，使开发者能够构建更加流畅、响应迅速的用户界面。`,
    excerpt: '探索React 18的新特性，包括自动批处理、Transition API和服务器端Suspense等...',
    category: '前端开发',
    tags: ['React', 'JavaScript', '前端'],
    createdAt: generateRandomDate(90),
    updatedAt: generateRandomDate(30),
    views: 1250,
    likes: 89,
    coverImage: 'https://via.placeholder.com/800x400?text=React+18',
    author
  },
  {
    id: '2',
    title: 'TypeScript 高级类型系统详解',
    content: `## 深入理解TypeScript的类型系统

TypeScript的类型系统是其最强大的特性之一，它提供了静态类型检查，帮助开发者在编译时发现错误。本文将详细介绍TypeScript的高级类型特性。

### 泛型

泛型允许我们创建可重用的组件，这些组件可以处理不同类型的数据，而不失去类型安全性。

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const output1 = identity<string>('myString');
const output2 = identity<number>(100);
\`\`\`

### 联合类型和交叉类型

联合类型表示一个值可以是几种类型之一，而交叉类型表示一个值同时具有多种类型的特性。

\`\`\`typescript
// 联合类型
function printId(id: number | string) {
  console.log('Your ID is:', id);
}

// 交叉类型
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

type ArtworksResponse = ArtworksData & ErrorHandling;
\`\`\`

### 类型守卫

类型守卫允许我们在运行时检查类型，以便在不同的分支中使用特定类型的特性。

这些高级类型特性使TypeScript成为一个强大的工具，可以帮助开发者构建更加健壮、可维护的应用程序。`,
    excerpt: '深入探讨TypeScript的高级类型特性，包括泛型、联合类型、交叉类型和类型守卫等...',
    category: '技术分享',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    createdAt: generateRandomDate(60),
    updatedAt: generateRandomDate(15),
    views: 980,
    likes: 76,
    coverImage: 'https://via.placeholder.com/800x400?text=TypeScript',
    author
  },
  {
    id: '3',
    title: '前端性能优化实战指南',
    content: `## 提升前端应用性能的实用技巧

性能优化是前端开发中不可忽视的重要环节。一个性能良好的应用不仅能提供更好的用户体验，还能提高用户留存率和转化率。本文将分享一些实用的前端性能优化技巧。

### 资源加载优化

1. **代码分割**：将代码拆分为多个小块，按需加载，减少初始加载时间。

\`\`\`javascript
// 使用React.lazy和Suspense进行代码分割
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
\`\`\`

2. **图片优化**：使用适当的图片格式、尺寸和压缩率，考虑使用WebP格式和响应式图片。

3. **缓存策略**：利用HTTP缓存、Service Worker和本地存储来减少重复请求。

### 运行时性能优化

1. **虚拟滚动**：对于长列表，只渲染可见区域的元素，减少DOM节点数量。

2. **防抖和节流**：限制事件处理函数的执行频率，避免不必要的计算。

3. **内存管理**：避免内存泄漏，及时清理不再使用的资源。

通过这些优化技巧，我们可以显著提升前端应用的性能，为用户提供更加流畅的体验。`,
    excerpt: '分享实用的前端性能优化技巧，包括资源加载优化和运行时性能优化等...',
    category: '技术分享',
    tags: ['性能优化', '前端开发', 'JavaScript'],
    createdAt: generateRandomDate(45),
    updatedAt: generateRandomDate(10),
    views: 1450,
    likes: 102,
    coverImage: 'https://via.placeholder.com/800x400?text=Performance+Optimization',
    author
  },
  {
    id: '4',
    title: 'Node.js 微服务架构设计',
    content: `## 构建可扩展的Node.js微服务系统

微服务架构已经成为现代应用开发的主流趋势，它将一个大型应用拆分为多个独立部署的小服务，每个服务专注于特定的业务功能。本文将介绍如何使用Node.js构建微服务架构。

### 微服务基础

微服务架构的核心思想是将一个大型应用拆分为多个小型、独立的服务，每个服务都有自己的数据库和业务逻辑。这些服务通过API进行通信，共同完成应用的整体功能。

### Node.js微服务架构设计

1. **服务拆分**：根据业务领域将应用拆分为多个微服务。

2. **API网关**：使用API网关统一管理服务入口，处理认证、限流等横切关注点。

\`\`\`javascript
// 使用Express构建简单的API网关
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 用户服务代理
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true
}));

// 订单服务代理
app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3002',
  changeOrigin: true
}));

app.listen(3000);
\`\`\`

3. **服务发现**：使用服务发现机制，使服务能够自动找到其他服务的位置。

4. **消息队列**：使用消息队列解耦服务间通信，提高系统的可靠性和可扩展性。

通过采用微服务架构，我们可以构建更加灵活、可扩展和易于维护的系统，更好地应对业务增长和变化。`,
    excerpt: '介绍如何使用Node.js构建微服务架构，包括服务拆分、API网关、服务发现和消息队列等...',
    category: '后端开发',
    tags: ['Node.js', '微服务', '架构设计'],
    createdAt: generateRandomDate(30),
    updatedAt: generateRandomDate(5),
    views: 890,
    likes: 65,
    coverImage: 'https://via.placeholder.com/800x400?text=Node.js+Microservices',
    author
  },
  {
    id: '5',
    title: '现代前端开发工具链推荐',
    content: `## 提升开发效率的必备工具

随着前端技术的快速发展，各种开发工具层出不穷。选择合适的工具可以显著提高开发效率和代码质量。本文将推荐一些现代前端开发中不可或缺的工具。

### 构建工具

1. **Vite**：新一代前端构建工具，提供极速的开发服务器和优化的构建输出。

2. **Webpack**：功能强大的模块打包器，适用于复杂的前端应用。

### 代码质量工具

1. **ESLint**：静态代码分析工具，用于识别和报告JavaScript代码中的模式问题。

2. **Prettier**：代码格式化工具，确保代码风格的一致性。

3. **TypeScript**：JavaScript的超集，添加了静态类型系统，提高代码的可维护性。

### 测试工具

1. **Jest**：零配置的JavaScript测试框架，提供快照测试、并行测试等功能。

2. **Cypress**：端到端测试框架，提供强大的测试API和友好的开发体验。

### 性能分析工具

1. **Chrome DevTools**：浏览器内置的开发工具，提供网络监控、性能分析等功能。

2. **Lighthouse**：Google开发的开源工具，用于评估网页的质量和性能。

选择合适的工具并将它们集成到开发工作流中，可以大大提高开发效率，改善代码质量，并确保应用的性能和用户体验。`,
    excerpt: '推荐现代前端开发中不可或缺的工具，包括构建工具、代码质量工具、测试工具和性能分析工具等...',
    category: '工具推荐',
    tags: ['前端开发', '开发工具', '效率提升'],
    createdAt: generateRandomDate(20),
    updatedAt: generateRandomDate(2),
    views: 750,
    likes: 58,
    coverImage: 'https://via.placeholder.com/800x400?text=Frontend+Tools',
    author
  }
];

// 根据ID获取博客文章
export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

// 根据分类获取博客文章
export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};

// 根据标签获取博客文章
export const getBlogPostsByTag = (tag: string): BlogPost[] => {
  return blogPosts.filter(post => post.tags.includes(tag));
};

// 搜索博客文章
export const searchBlogPosts = (query: string): BlogPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery)
  );
};

// 获取热门博客文章
export const getPopularBlogPosts = (limit: number = 3): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

// 获取最新博客文章
export const getLatestBlogPosts = (limit: number = 3): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};