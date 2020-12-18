import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import VueTour from 'vue-tour'

import '@/icons' // icon
import '@/permission' // permission control

require('vue-tour/dist/vue-tour.css')
Vue.use(ElementUI)
Vue.use(VueTour)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
