import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 找到根元素并渲染应用
const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('根元素不存在，无法渲染应用');
}
