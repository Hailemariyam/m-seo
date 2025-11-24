import { createRouter, createWebHistory } from 'vue-router';
import { setupSeoRouter } from '../../src/adapters/VueSPAAdapter';

// Import page components
import HomePage from './HomePage.vue';
import BlogPost from './BlogPost.vue';
import ProductPage from './ProductPage.vue';
import BreadcrumbPage from './BreadcrumbPage.vue';
import FAQPage from './FAQPage.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Home',
      description: 'Welcome to our Vue site with SEO'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogPost,
    meta: {
      title: 'Blog',
      description: 'Read our latest blog posts'
    }
  },
  {
    path: '/product',
    name: 'Product',
    component: ProductPage,
    meta: {
      title: 'Product',
      description: 'Shop our products'
    }
  },
  {
    path: '/breadcrumbs',
    name: 'Breadcrumbs',
    component: BreadcrumbPage,
    meta: {
      title: 'Breadcrumbs',
      description: 'Breadcrumb navigation example'
    }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQPage,
    meta: {
      title: 'FAQ',
      description: 'Frequently asked questions'
    }
  }
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Setup automatic SEO on route changes
setupSeoRouter(router, (route) => ({
  title: `${route.meta.title} - My Vue Site`,
  description: route.meta.description as string,
  canonical: `https://example.com${route.path}`,
  siteName: 'My Vue Site',
  locale: 'en_US'
}));

export default router;
