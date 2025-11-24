import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import BlogPost from './pages/BlogPost.vue'
import ProductPage from './pages/ProductPage.vue'
import BreadcrumbPage from './pages/BreadcrumbPage.vue'
import FAQPage from './pages/FAQPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage, name: 'home' },
    { path: '/blog/:slug', component: BlogPost, name: 'blog' },
    { path: '/product/:id', component: ProductPage, name: 'product' },
    { path: '/breadcrumbs', component: BreadcrumbPage, name: 'breadcrumbs' },
    { path: '/faq', component: FAQPage, name: 'faq' }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
