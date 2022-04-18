<template>
  <div class="wallet_btn">
    <div class="wall_txt" v-if="!walletAddress" @click="openConnectionMode = true">Connected Wallet</div>
    <div class="wall_txt" v-else @click="openConnectionMode = true">
      {{walletAddress.substr(0,4)}}***{{walletAddress.substring(walletAddress.length - 4)}}
    </div>

    <div class="wb_pop" v-show="openConnectionMode" @touchmove.prevent="">
      <div class="wb_wrap" @click="openConnectionMode = false"></div>
      <div class="wbp_mbox">
        <div style="transform: translate(0px, 0px); opacity: 1;">
          <div class="iFjsgm">
            <div class="eCTAfC">
              <div class="guRQze">
                <div class="bbIKGE">
                  <div v-if="walletAddress">Account</div>
                  <div v-else></div>
                  <img src="~@/assets/imgs/web3/enWSfS.png" class="enWSfS" @click="openConnectionMode = false">
                </div>
                <div class="iMxnOZ">
                  <div style="flex: 1 1 0%;" v-if="walletAddress">
                    <div class="gmwOCX">
                      <div class="kcZnpa">
                        <div class="fsGVAo" @click="changeWall()">Change</div>
                      </div>
                      <div class="fookfc">
                        Connected with
                      </div>
                      <div class="eUPoJu">
                        <img src="~@/assets/imgs/web3/ple_icon.png" style="width: 25px">
                        <!-- <div class="cVqNCr">{{$walletFuc.walletAddress.substr(0,6)}}***{{$walletFuc.walletAddress.substring($walletFuc.walletAddress.length - 6)}}</div> -->
                        <div class="cVqNCr">{{walletAddress}}</div>
                      </div>
                    </div>
                    <div class="fdgtVi">
                      <div class="fsGVAo" @click="changeWall()">Change</div>
                    </div>
                  </div>
                  <div class="gKOKkl" v-else>
                    <div class="etvlvq" @click="selectConnectionMode('MetaMask')">
                      <img src="~@/assets/imgs/web3/wal_Metamask.png" class="grCaBj">
                      <div class="bMvWcO">Metamask</div>
                    </div>
                    <div class="etvlvq" @click="selectConnectionMode('MetaMask')">
                      <img src="~@/assets/imgs/web3/TokenPocket.png" class="grCaBj">
                      <div class="bMvWcO">Token Pocket</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      openConnectionMode: false // 授权方式菜单
    }
  },
  computed: {
    walletAddress: {
      get () {
        return this.$walletFuc.walletAddress
      }
    },
  },
  mounted () {
    this.$EventBus.$on('openConnectionMode', (flag) => {
      this.openConnectionMode = flag
    })
  },
  methods: {
    selectConnectionMode (item) { // 选择授权方式
      if (item === 'MetaMask') {
        this.$walletFuc.metaMaskConnect()
      } else if (item === 'WalletConnect') {
        this.$walletFuc.walletConnect()
      }
      this.openConnectionMode = false
    },
    changeWall () {
      this.$walletFuc.delWalletConnect()
    }
  }
}
</script>

<style scoped>
.wall_txt {
  margin: 0 auto;
  width: 180px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  word-break: break-all;
  background: #21E1AE;
  border-radius: 17px;
  color: #242424;
}
.wallet_btn {
  cursor: default;
  text-align: center;
}
.wb_pop {
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  position: fixed;
  z-index: 2500;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.wb_wrap {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.wbp_mbox {
  box-sizing: border-box;
  margin: 0px auto;
  max-width: 600px;
  padding: 0px 24px;
  width: 100%;
}
.iFjsgm {
  border-radius: 12px;
  box-shadow: rgb(33 33 33) 24px 24px 48px -24px;
  position: relative;
}
.eCTAfC {
  background-color: rgb(25, 25, 31);
  padding: 20px;
  border-radius: 10px;
}
.guRQze {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  padding: 24px;
}
.bbIKGE {
  -webkit-box-align: center;
  align-items: center;
  color: rgb(255, 255, 255);
  display: flex;
  font-size: 18px;
  font-weight: 700;
  height: 72px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  margin-top: -24px;
}
.enWSfS {
  width: 30px;
  cursor: pointer;
}
.iMxnOZ {
  display: flex;
  flex-direction: row;
  -webkit-box-pack: center;
  justify-content: center;
  color: rgb(255, 255, 255);
  margin-bottom: 24px;
}
.fdgtVi {
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  margin-top: 20px;
  display: none;
}
.fsGVAo {
  background-color: rgba(255, 255, 255, 0);
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  height: 36px;
  -webkit-box-pack: center;
  justify-content: center;
  outline: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  width: 100px;
  opacity: 1;
  user-select: none;
}
.fsGVAo:hover {
  border-color: rgb(248, 182, 41);
  color: rgb(248, 182, 41);
}

.gmwOCX {
  padding: 30px;
  position: relative;
  flex: 1 1 0%;
  border-radius: 5px;
  background-color: rgb(36, 32, 47);
  width: 100%;
}

.kcZnpa {
  position: absolute;
  z-index: 10;
  right: 20px;
  top: 20px;
}

.eUPoJu {
  margin: 10px 0px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}

.cVqNCr {
  padding-top: 10px;
  margin-left: 20px;
  font-size: 20px;
  color: rgb(255, 255, 255);
  word-break: break-all;
}

.fookfc {
  opacity: 0.5;
  font-size: 12px;
  line-height: 1;
  color: var(--white);
}

.gKOKkl {
  flex: 1 1 0%;
}

.etvlvq {
  cursor: pointer;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(48, 46, 58);
  padding: 13px 25px;
  border-radius: 5px;
  font-size: 18px;
  margin: 10px 0px;
}

.etvlvq:hover {
  background-color: rgb(36, 32, 47);
}

.grCaBj {
  width: 40px;
}

.bMvWcO {
  margin-left: 15px;
}

@media (max-width: 1000px) {
  .eCTAfC {
    padding: 10px 10px 20px;
    overflow: hidden;
  }
  .fdgtVi {
    display: inherit;
  }
  .gmwOCX {
    padding: 30px 20px;
  }
  .kcZnpa {
    display: none;
  }
}

</style>