import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import PostsView from '../views/PostsView.vue'
import AccountView from '../views/AccountView.vue'
import SinglePostView from '../views/SinglePostView.vue'
import store from '../store.js'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      requiresAuth: true
    }    
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostsView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/post/:id',
    name: 'SinglePostView',
    component: SinglePostView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router
