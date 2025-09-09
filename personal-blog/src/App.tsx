import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import TagsPage from './pages/TagsPage';
import ArticleUpload from './pages/ArticleUpload';
import ArticlesPage from './pages/ArticlesPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/upload" element={<ArticleUpload />} />
        <Route path="/edit/:id" element={<ArticleUpload />} />
      </Routes>
    </Router>
  );
}

export default App;