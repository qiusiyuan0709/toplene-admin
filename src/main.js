import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import JSONbig from 'json-bigint'

import router from './router'

import './styles/index.less'
import 'nprogress/nprogress.css'

// 配置 axios 的基础路径
// 也就是说配置了这个东西，你就不用每次都写长长的 http://xxxx了
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// 使用 JSONbig 处理返回数据中超出 JavaScript 安全整数范围的数字
// JSONbig 自己会分析数据中的哪个数字超出范围了
// // 由于后端的数据 id 超出了 JavaScript 的安全整数范围，会导致整数无法精确表示
// 可以使用 json-biginit 来处理，它会帮你把找出范围的数字给处理好
axios.defaults.transformResponse = [
  function (data) {
    // data 是未经处理的后端响应数据：JSON 格式字符串
    // Do whatever you want to transform the data
    return JSONbig.parse(data)
  }
]

// 往Vue原型对象中添加成员，尽量使用 $名字 起名字，目的是为了防止和组件中的成员冲突
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

/**
 * Axios 请求拦截器
 * 所有使用的 axios 发送的请求都要经过这里
 * config 是本次请求相关的配置对象
 * 我们可以通过修改 config 配置来统一自定义请求相关参数
 * return config 就是允许通过的方式
 */
axios.interceptors.request.use(
  config => {
    const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
    if (userInfo) {
      config.headers.Authorization = `Bearer ${userInfo.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * Axios 响应拦截器
 * 统一处理响应的数据格式
 */
axios.interceptors.response.use(
  response => {
    return response.data.data
  },
  error => {
    // 400的状态码会进入这里
    const status = error.response.status
    if (status === 401) {
      // 务必删除本地存储中的用户信息数据
      window.localStorage.removeItem('user_info')
      // 跳转到登陆页面
      router.push({
        name: 'login'
      })
    }
    return Promise.reject(error)
  }
)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
