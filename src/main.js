import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import router from './router'

import './styles/index.less'
import 'nprogress/nprogress.css'

// 配置 axios 的基础路径
// 也就是说配置了这个东西，你就不用每次都写长长的 http://xxxx了
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// 往Vue原型对象中添加成员，尽量使用 $名字 起名字，目的是为了防止和组件中的成员冲突
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

/**
 * Axios 请求拦截器
 * 所有使用的 axios 发送的请求都要经过这里
 * config 是本次请求相关的配置对象
 * return config 就是允许通过的方式
 */
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  config.header.Authorization = `Bearer ${userInfo.token}`
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * Axios 响应拦截器
 */
axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
