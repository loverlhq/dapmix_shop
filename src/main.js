import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// import Interface from './plugins/interface'

Vue.config.productionTip = false

// 配置axios默认访问链接
axios.defaults.baseURL = 'https://www.dapmix.top/api/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

// Vue.prototype.$interface = Interface

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
