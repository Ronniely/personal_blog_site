import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import TagsPage from './pages/TagsPage';
import TagDetailPage from './pages/TagDetailPage';
import ArticleUpload from './pages/ArticleUpload';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/tag/:tagId" element={<TagDetailPage />} />
        <Route path="/upload" element={<ArticleUpload />} />
      </Routes>
    </Router>
  );
};

export default App;