import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import i18n from '@/utils/lang'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Components from '@/components/index'
import '@/styles/index.scss' // global css
import * as filters from '@/filters/index'
for (const filtersKey in filters) {
  Vue.filter(filtersKey, filters[filtersKey])
}

import Print from 'vue-print-nb'
Vue.use(Print)

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
Vue.use(Components)

import * as directives from '@/directives/index'// 引入一次性指令
// 遍历  一次性注册所有指令
for (const key in directives) {
  Vue.directive(key, directives[key])
}
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
