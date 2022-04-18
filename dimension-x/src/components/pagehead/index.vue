<template>
  <div class="ph">
    <div class="ph_wrap">
      <div class="phw_mbox">
        <img src="~@/assets/imgs/logo.png" @click="$router.push({name: 'home'})" class="logo">
        <div class="phw_meta">
          <walletBtn></walletBtn>
        </div>
        <div class="phw_menu" @click="showMenu = true">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>

    <div class="pg_pop" v-if="showMenu">
      <div class="pg_bg" @click="showMenu = false"></div>
      <div class="pg_mbox">
        <div class="pgm_list">
          <div @click="$router.push({name: 'home'}); showMenu = false">
            <img src="~@/assets/imgs/ph1.png">
            <div>市场</div>
          </div>
          <div @click="$router.push({name: 'mine'}); showMenu = false">
            <img src="~@/assets/imgs/ph2.png">
            <div>我的</div>
          </div>
          <div @click="$router.push({name: 'invite'}); showMenu = false">
            <img src="~@/assets/imgs/ph6.png">
            <div>邀请</div>
          </div>
          <div @click="$toast('coming soon'); showMenu = false">
            <img src="~@/assets/imgs/ph4.png">
            <div>语言</div>
          </div>
          <div @click="$toast('coming soon'); showMenu = false">
            <img src="~@/assets/imgs/ph5.png">
            <div>帮助文档</div>
          </div>
          <!-- <div class="pgml_lang">
            <img src="~@/assets/imgs/lang_zh.png" v-if="nowLang === 'en'"  @click="changeLang('zh')">
            <img src="~@/assets/imgs/lang_en.png" v-else  @click="changeLang('en')">
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import walletBtn from '@/web3/walletBtn.vue'

export default {
  components: {
    walletBtn
  },
  data () {
    return {
      showMenu: false,
      nowLang: localStorage.getItem('lang') || 'en',
      myId: '0',
      timerFn: null,
    }
  },
  computed: {
    walletAddress: {
      get () {
        return this.$walletFuc.walletAddress
      }
    }
  },
  watch: {
    walletAddress() {}
  },
  created () {
    // this.init()
    // this.setTimer()
  },
  methods: {
    setTimer () {
       if (this.timerFn) {
        clearInterval(this.timerFn)
      }
      this.timerFn = setInterval(() => {
        this.init()
      }, this.$timer)
    },
    init () {
      if (this.walletAddress) {
      }
    },
    changeLang (lang) { // 切换语言
      this.nowLang = lang
      this.$i18n.locale = lang
      localStorage.setItem('lang', lang)
      this.showMenu = false
    },
  }
}
</script>

<style lang="scss" scoped>
.pg_pop {
  .pg_bg {
    opacity: 0;
  }
  .pg_mbox {
    left: initial;
    top: 44px;
    right: 12px;
    transform: none;
    width: 120px;
    min-height: initial;
    padding: 0 0 0 15px;
    border-radius: 8px;
    background: #fff;
    .pgm_wl {
      padding: 20px 0 0 0;
    }
    .pgm_list {
      >div {
        display: flex;
        align-items: center;
        height: 55px;
        font-size: 15px;
        color: #000;
        border-bottom: 1px solid #DFDFDF;
        >img {
          margin: 0 12px 0 0;
          height: 18px;
        }
      }
      .pgml_lang {
        >img {
          width: 24px;
        }
      }
    }
  }
}
.ph {
  .ph_wrap {
    height: 44px;
    .phw_mbox {
      position: fixed;
      left: 50%;
      transform: translate(-50%, 0);
      height: 44px;
      max-width: 450px;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0 15px;
      z-index: 100;
      background: rgb(3, 29, 3);
      .logo {
        width: 27px;
      }
      .phw_mid {
        margin: 0 12px 0 auto;
      }
      .phw_meta {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
      }
      .phw_menu {
        margin: 0 0 0 auto;
        width: 23px;
        >div {
          height: 2px;
          border-radius: 1px;
          background: #B7B7B7;
        }
        >div:nth-child(2) {
          margin: 6px 0;
        }
      }
    }
  }
}
</style>
