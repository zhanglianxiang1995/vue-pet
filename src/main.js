import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import ElementUIs from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//字体图标
import './assets/fonts/iconfont.css'

//导入axios
import axios from 'axios'

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config => {
  config.headers.Authorization =window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false
Vue.use(ElementUIs)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
