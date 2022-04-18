<template>
  <div class="abox">
      <img src="~@/assets/imgs/home_pg.png" class="ac_img">
      <div class="aobox">
          <div class="pt">
              <div><span class="pt_grey">价格:</span><span class="pt_blue">{{$toFixed($BigNumber(displayData._price).dividedBy(Math.pow(10, 18)))}} U</span></div>
              <div><span class="pt_grey">距离结束:<span class="pt_blue">{{day}}</span> 天 </span><span class="pt_blue">{{hour}}</span></div>
          </div>
          <div class="si_name">{{displayData._nameinfo}}</div>
        <div class="sibox br">
                <div class="si_o">创始人:  <span class="si_i">{{'abc'}}</span></div>
                <div class="si_o">持有人: <span class="si_i">{{displayData.sellAddr.substr(0,10)}}.....{{displayData.sellAddr.substring(displayData.sellAddr.length - 6)}}</span></div>
        </div>
        <div class="pg_inv">
            <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 交易记录
        </div>
        <div class="ajlbox">
            <div class="ade_box br">
                <div class="idboxl">
                    <div class="idbdiv">1</div>
                    <div style=" color: rgb(164,161,161)">{{'hgjfgffdj'}}</div>
                </div>
                 <div class="ir_s1">{{$toFixed(567)}} U</div>
            </div>
            <div class="ade_box br">
                <div class="idboxl">
                    <div class="idbdiv">2</div>
                    <div style=" color: rgb(164,161,161)">{{'hgjfgffdj'}}</div>
                </div>
                 <div class="ir_s1">{{$toFixed(567)}} U</div>
            </div>
            <div class="ade_box br">
                <div class="idboxl">
                    <div class="idbdiv">3</div>
                    <div style=" color: rgb(164,161,161)">{{'hgjfgffdj'}}</div>
                </div>
                 <div class="ir_s1">{{$toFixed(567)}} U</div>
            </div>
            <div class="ade_box br">
                <div class="idboxl">
                    <div class="idbdiv grey">4</div>
                    <div style=" color: rgb(164,161,161)">{{'hgjfgffdj'}}</div>
                </div>
                 <div class="ir_s1">{{$toFixed(567)}} U</div>
            </div>
        </div>
        <div class="pg_inv">
            <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 说明
        </div>
        <div class="sibox br">
            <div class="disbet pr">
                <div class="si_o">起拍:<span class="si_i">{{$toFixed($BigNumber(displayData._price).dividedBy(Math.pow(10, 18)))}} U</span></div>
                <div class="si_o">加价:<span class="si_i">{{$toFixed($BigNumber(displayData._amplitude).dividedBy(Math.pow(10, 18)))}} U</span></div>
                <div class="si_o">保证金:<span class="si_i">{{$toFixed($BigNumber(displayData._amplitude).dividedBy(Math.pow(10, 18)))}} U</span></div>
            </div>
            <div class="si_o">加价幅度: <span class="si_i">{{$toFixed($BigNumber(displayData._amplitude).dividedBy(Math.pow(10, 18)))}} U</span></div>
        </div>
        <div class="pg_inv">
            <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 作品描述
        </div>
        <div class="zpms">{{displayData._brand}}</div>
        <div class="pg_inv">
            <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 作品信息
        </div>
        <div class="sibox br">
                <div class="si_o">合约地址:  <span class="si_i">{{nftAddr.substr(0,10)}}.....{{nftAddr.substring(nftAddr.length - 6)}}</span></div>
                <div class="si_o">编号: <span class="si_i">{{displayData._id}}</span></div>
        </div>
        <div class="cj_but" v-if="isAuth">
            <div class="textbox_msg">
                <input class="input_box" placeholder="     请输入价格" type="number" v-model="inputValue" maxlength="100" />
            </div>
            <div class="pbut" @click="auction">出价</div>
        </div>
        <div class="apbut" v-else-if="!isAuth" @click="approveUSDT">授权UDST</div>
      </div>
  </div>
</template>

<script>
import abiauction from '@/web3/abiauction.json'

export default {
  components: {
  },
  data () {
    return {
        nftAddr:'0x24A63ea5957210ebD6BAC5AD6648d91ebfFad460',
        auctionAddr:'0xA0152E3AA2329E8d22DCFd16c90145671428f95F',
        isAuth:false,
        displayData:this.$route.params.data,
        inputValue:'',



        testData:[
            {name:'行运一条龙',time:1646989886,price:23124176},
            {name:'行运一条龙',time:1646989886,price:23124176},
            {name:'行运一条龙',time:1646989886,price:23124176},
        ]
    }
  },
  computed: {
    walletAddress:{
      get () {
        return this.$walletFuc.walletAddress
      }
    },
      day(){
          return this.displayData._endtimeinfo >= Date.parse(new Date())/1000?
          parseInt((this.displayData._endtimeinfo - Date.parse(new Date())/1000)/86400):0
      },
      hour(){
          return this.displayData._endtimeinfo >= Date.parse(new Date())/1000?
          this.$timestampToTime((this.displayData._endtimeinfo - Date.parse(new Date())/1000)%86400):'00:00:00'
      },
  },
  watch: {
    walletAddress () {
        this.init()
    }
  },
  created () {
      this.init()
    this.setTimer()
  },
  methods: {
    init () {
      if (this.walletAddress) {
        this.$walletFuc.isTokenAddress(this.$usdtAdd, this.auctionAddr, Math.pow(10, 18)).then(res => {
            this.isAuth = res
        })
      }
    },
    setTimer () { // 定时器
      if (this.timerFn) {
        clearInterval(this.timerFn)
      }
      this.timerFn = setInterval(() => {
        this.init()
      }, this.$timer)
    },
    approveUSDT(){
        if (!this.walletAddress) {
            this.$toast(this.$t('js.Pleaseconnectyourwallet'))
            return false
        }
        this.$dialog.confirm({
            message: this.$t('js.Tokenauthorizationis'),
            confirmButtonText: this.$t('js.confirm'),
            cancelButtonText: this.$t('js.cancel'),
        }).then(() => {
            this.$walletFuc.approve(this.$usdtAdd, this.auctionAddr).then(res => {
            if (res === '1') {
                this.isAuth = true
            }
            })
        })
    },
    async auction(){
        if (!this.walletAddress) {
            this.$toast(this.$t('js.Pleaseconnectyourwallet'))
            return false
        } else if (!this.inputValue || !/^\d+(\.\d+)?$/.test(this.inputValue)) {
            this.$toast(this.$t('Crossjs.Pleaseenterthe'))
            return false
        }
        var _price = this.$BigNumber(this.inputValue).multipliedBy(Math.pow(10, 18))
        this.$toast.loading({
            message: this.$t('js.loading'),
            duration: 0
        })
        try {
            const cont = this.$contract(abiauction, this.auctionAddr)
            let value = '0'
            const encodeABI = await cont.methods.buy(this.nftAddr,this.displayData._id,_price).encodeABI()
            const gasPrice = await this.$walletFuc.getGasPrice()
            const gas = await this.$walletFuc.web3EstimateGas(encodeABI, this.auctionAddr, gasPrice, value)
            let txHash
            if (this.$walletFuc.connectionMode === 'MetaMask') {
            txHash = await this.$walletFuc.metaMaskSendTransaction(encodeABI, this.auctionAddr, gasPrice, gas, value)
            } else if (this.$walletFuc.connectionMode === 'WalletConnect') {
            txHash = await this.$walletFuc.walletConnectSendTransaction(encodeABI, this.auctionAddr, gasPrice, gas, value)
            }
            this.$router.push({name: 'home'});
            return Promise.resolve(txHash)
        } catch (err) {
            return Promise.reject(err)
        }
    },
  }
}
</script>


<style lang="scss" scoped>
.abox {
   .br {
        border-radius: 12px;
    }

    .ac_img{
        width: 100%;
        height: 300px;
    }

    .aobox {
        padding: 0 9px;
        .pt{
            display: flex;
            justify-content: space-between;
            margin-top: 23px;
            .pt_grey {
                font-size: 15px;
                color: rgba(164,161,161,1);
            }
            .pt_blue{
                color: rgb(33,225,174);
                    font-size: 17px;
                    font-weight: 400;
            }
        }

        .si_name {
            margin: 17px 10px;
            font-size: 23px;
            font-weight: 600;
        }

        .sibox{
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                background:rgba(34,83,74,.5);
                margin-top: 30px;
                height: 79px;
                font-size: 15px;
                padding-left: 15px;
                .si_o{
                    color: rgba(164,161,161,1);
                }
                .si_i{
                    color: white;
                }
                .disbet {
                    display: flex;
                    justify-content: space-between;
                }
                .pr{
                    padding-right: 15px;
                }
        }

        .pg_inv {
            font-size: 16px;
            font-weight: 500;
            display: flex;
            align-items: flex-end;
            margin-top: 15px;
            .pgt_ibox {
            margin-right: -8px;
            width: 28px;
            }
        }

        .ajlbox{
            margin: 15px 2px;
            .ade_box{
                display: flex;
                justify-content: space-between;
                align-items: center;
                background:rgba(34,83,74,.5);
                width: 100%;
                height: 61px;
                margin: 7px 0;
                .idboxl{
                    display: flex;
                    align-items: center;
                    .idbdiv{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 26px;
                        height: 26px;
                        background: rgb(33,225,174);
                        border-radius: 7px;
                        margin: 0 17px;
                    }
                    .grey{
                        background: grey;
                    }
                }
                .ir_s1{
                    margin-right: 10px;
                    color: rgb(33,225,174);
                    font-size: 21px;
                    font-weight: 400;
                }
            }
        }

        .zpms {
            margin: 15px 0 17px 0;
            font-size: 17px;
            font-weight: 500;
            color: rgba(164,161,161,1);
        }

        .cj_but{
            display: flex;
            margin: 17px 0;
            .textbox_msg {
                display: flex;
                align-items: center;
               background:rgba(34,83,74,.5);
                padding: 0 0 0 5px;
                width: 75%;
                font-size: 17px;
                .input_box {
                    border: none;
                    background: none;
                    color:rgba(255,255,255,0.7);
                    width: 100%;
                    height: 32px;
                }
            }
            .pbut {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 25%;
                height: 60px;
                background: rgb(33,225,174);
                color: black;
                font-size: 19px;
                font-weight: 700;
            }
        }

        .apbut{
            margin: 17px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60px;
            background: rgb(33,225,174);
            color: black;
            font-size: 19px;
            font-weight: 700;
        }
    }

}
</style>