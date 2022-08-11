import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhElement from 'element-ui/lib/locale/lang/zh-CN'
import enElement from 'element-ui/lib/locale/lang/en'
import localeZh from './zh'
import localeEn from './en'
import Cookies from 'js-cookie'
Vue.use(VueI18n)

const messages = {
  en: {
    message: 'hello',
    ...enElement, // 或者用 Object.assign({ message: 'hello' }, enLocale)
    ...localeEn
  },
  zh: {
    message: '你好',
    ...zhElement, // 或者用 Object.assign({ message: '你好' }, zhLocale)
    ...localeZh
  }
}

const i18n = new VueI18n({
  locale: Cookies.get('lang') || 'en',
  messages
})
export default i18n
