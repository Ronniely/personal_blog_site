import { Category, BlogPost } from '../types';
import { blogPosts } from './mockData';

// 初始化分类数据到localStorage
export const initializeCategories = (): void => {
  const savedCategories = localStorage.getItem('categories');
  if (!savedCategories) {
    // 从博客文章中提取初始分类
    const initialCategories = Array.from(new Set(blogPosts.map(post => post.category)))
      .map((name, index) => ({
        id: (index + 1).toString(),
        name,
        count: blogPosts.filter(post => post.category === name).length
      }));
    localStorage.setItem('categories', JSON.stringify(initialCategories));
  }
};

// 获取所有分类（包含动态计算的文章数量）
export const getCategories = (): Category[] => {
  const savedCategories = localStorage.getItem('categories');
  if (!savedCategories) return [];

  const categories = JSON.parse(savedCategories) as Category[];
  // 动态计算每个分类的文章数量
  return categories.map(category => ({
    ...category,
    count: blogPosts.filter(post => post.category === category.name).length
  }));
};

// 添加新分类
export const addCategory = (categoryName: string): boolean => {
  const categories = getCategories();
  // 检查分类是否已存在
  if (categories.some(cat => cat.name === categoryName)) return false;

  const newCategory: Category = {
    id: Date.now().toString(),
    name: categoryName,
  };

  const updatedCategories = [...categories, newCategory];
  localStorage.setItem('categories', JSON.stringify(updatedCategories));
  return true;
};

// 删除分类
export const deleteCategory = (categoryId: string): boolean => {
  const categories = getCategories();
  const updatedCategories = categories.filter(cat => cat.id !== categoryId);

  if (updatedCategories.length === categories.length) return false;

  localStorage.setItem('categories', JSON.stringify(updatedCategories));
  return true;
};

// 初始化分类数据
initializeCategories();