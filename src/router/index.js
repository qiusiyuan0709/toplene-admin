import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [{

    name: 'layout',
    path: '/',
    component: () => import('@/views/layout'),
    children: [{
      name: 'home',
      path: '', // 它就是 layout 的默认子路由
      component: () => import('@/views/home')
    },
    {
      name: 'publish',
      path: '/publish', // 它就是 layout 的默认子路由
      component: () => import('@/views/publish')
    }
    ]
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
