import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import AboutView from './views/AboutView.vue'
import AccountView from './views/AccountView.vue'
import CategoriesView from './views/CategoriesView.vue'
import HomeView from './views/HomeView.vue'
import PromotionsView from './views/PromotionsView.vue'
import ProductDetailView from './views/ProductDetailView.vue'
import './style.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/categories', name: 'categories', component: CategoriesView },
    { path: '/promotions', name: 'promotions', component: PromotionsView },
    { path: '/account', name: 'account', component: AccountView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/product/:id', name: 'product-detail', component: ProductDetailView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

createApp(App).use(router).mount('#app')
