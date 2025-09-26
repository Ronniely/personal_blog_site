import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ArticleDetail from '../views/ArticleDetail.vue';
import CategoriesPage from '../views/CategoriesPage.vue';
import TagsPage from '../views/TagsPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import UploadArticle from '../views/UploadArticle.vue';
import Layout from '../components/Layout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      props: { sidebar: true },
      children: [
        {
          path: '',
          component: HomePage
        },
        {
          path: '/article/:id',
          component: ArticleDetail
        },
        {
          path: '/categories',
          component: CategoriesPage
        },
        {
          path: '/tags',
          component: TagsPage
        },
        {
          path: '/upload',
          component: UploadArticle,
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/login',
      component: LoginPage
    },
    {
      path: '/register',
      component: RegisterPage
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;