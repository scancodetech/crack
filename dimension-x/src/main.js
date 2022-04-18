import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import { Toast, Popup, Swipe, SwipeItem, Popover,Checkbox } from 'vant'
import { Slider,Upload,Image } from 'element-ui'
import 'vant/lib/toast/style'
import '@/assets/css/global.scss'
import Tools from '@/assets/js/tools.js'
import BigNumber from 'bignumber.js'
import '@/web3/index.js'
import walletFuc from '@/web3/walletFuc.js'
import VueClipboard from 'vue-clipboard2'
import '@vant/touch-emulator'
import service from '@/api/request.js'


Vue.prototype.$EventBus = new Vue()
Vue.prototype.$BigNumber = BigNumber
Vue.prototype.$walletFuc = walletFuc
Vue.prototype.$pageData = { page: 1, pageLength: 10 } // 默认翻页页码和每页条数
Vue.prototype.$service = service

Vue.use(VueClipboard)
Vue.use(VueI18n)
Vue.use(Toast)
Vue.use(Popup)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Tools)
Vue.use(Slider)
Vue.use(Upload)
Vue.use(Image)
Vue.use(Popover)
Vue.use(Checkbox)


// 将所有 Toast 的展示时长设置为 2000 毫秒
Toast.setDefaultOptions({ duration: 2000, overlay: true })
// 将所有 loading Toast 设置为背景不可点击
Toast.setDefaultOptions('loading', { forbidClick: true, loadingType: 'spinner' })

const lang = localStorage.getItem('lang') || 'en'
const i18n = new VueI18n({
  locale: lang,  // 语言标识
  messages: {
    'zh': require('./i18n/zh.js'),
    'en': require('./i18n/en.js')
  }
})

Vue.prototype.$myI18n = i18n

function isPc () { // 是否PC端
  const userAgentInfo = navigator.userAgent
  const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  Vue.prototype.$isPc = true
  agents.forEach((item, index) => {
    if (userAgentInfo.indexOf(item) > 0) {
      Vue.prototype.$isPc = false
    }
  })
}
isPc()
window.onresize = isPc()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
