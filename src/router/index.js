import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: () => import('@/views/home')
  },
  {
    name: 'layout',
    path: '/layout',
    component: () => import('@/views/layout')
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login')
  }
  ]
})

router.beforeEach((to, from, next) => {
  nprogress.start()
  next()
})

router.afterEach((to, from) => {
  nprogress.down()
})
export default router
