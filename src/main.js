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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
