import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import toast from 'components/common/toast'
import Fastclick from 'fastclick'

//解决移动端300ms延迟
Fastclick.attach(document.body)

Vue.config.productionTip = false
// 安装toast插件
Vue.use(toast)

// 安装懒加载插件


Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
