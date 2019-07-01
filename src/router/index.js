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
    { // 发布文章
      name: 'publish',
      path: '/publish', // 它就是 layout 的默认子路由
      component: () => import('@/views/publish')
    },
    { // 编辑文章
      name: 'publish-edit',
      path: '/publish/:id', // 它就是 layout 的默认子路由
      component: () => import('@/views/publish')
    },
    {
      name: 'article-list',
      path: '/article', // 它就是 layout 的默认子路由
      component: () => import('@/views/article')
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
  const userInfo = window.localStorage.getItem('user_info')
  nprogress.start()
  // next()
  if (to.path !== '/login') {
    // 非登录页面
    //   没有登录，跳转到登录页
    if (!userInfo) {
      // 如果是来自登录页的页面，是不会重新进行页面导航的，也就不会触发后面的 afterEach 钩子
      // 所以在这里手动结束动画，防止出现在登录页访问其他页面顶部一直 loading 的问题。
      if (from.path === '/login') {
        nprogress.done()
      }
      next({
        name: 'login'
      })
      // next('/login')
      // next({ path: '/login' })
    } else {
      //   登录了，允许通过
      next()
    }
  } else {
    // 登录页面
    //   没有登录，允许通过
    if (!userInfo) {
      next()
    } else {
      //   登录了，不允许通过
      // next(false) // 中断当前导航
      // next()
      // next({ name: 'home' })
      // window.location.href = '/#/'
      next({
        name: 'home'
      })
      window.location.reload()
    }
  }
})

router.afterEach((to, from) => {
  nprogress.done()
})
export default router
