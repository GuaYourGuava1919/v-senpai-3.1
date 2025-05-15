import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebaseConfig'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: { requiresAuth: true }, // ← 限制需要登入
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('../views/FeedbackView.vue'),
    },
    {
      path: '/personal',
      name: 'personal',
      component: () => import('../views/PersonalView.vue'),
    },
  ],
})
// 簡單的登入快取（避免重複 onAuthStateChanged）
let currentUser: any = null
onAuthStateChanged(auth, (user) => {
  currentUser = user
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    // 如果需要登入但未登入，導向首頁或登入頁
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
