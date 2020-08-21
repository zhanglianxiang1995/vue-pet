import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import ElementUIs from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//字体图标
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false
Vue.use(ElementUIs)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
