<template>
  <div class="sbox">
      <el-image :src="'http://156.236.70.120/ipfs/'+displayData._urlinfo" lazy class="si_img"></el-image>
      <div class="mobox">
        <div class="si_name">{{displayData._nameinfo}}</div>
        <div class="sibox br">
                <div class="si_o">创始人:  <span class="si_i">{{'abc'}}</span></div>
                <div class="si_o">持有人: <span class="si_i">{{displayData.sellAddr.substr(0,10)}}.....{{displayData.sellAddr.substring(displayData.sellAddr.length - 6)}}</span></div>
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
        <div class="pg_inv">
            <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 交易记录
        </div>
        <div class="obox">
            <div class="idetail_box br" v-for="(v,i) in testData" :key="i">
                <div class="idboxl">
                    <div class="idbn">{{v.name}}</div>
                    <div class="idbt">{{$timestampToTime(v.time)}}</div>
                </div>
                 <div class="ir_s1">{{$toFixed($BigNumber(v.price).dividedBy(Math.pow(10, 18)))}} U</div>
            </div>
        </div>
        <div class="pbut" v-if="walletAddress == displayData.sellAddr.toLowerCase()"  @click="cancelSell">下架</div>
        <div class="pbut" v-else-if="isAuth" @click="getnft">支付<span class=""> {{$toFixed($BigNumber(displayData._price).dividedBy(Math.pow(10, 18)))}} U </span>立即购买</div>
        <div class="pbut" v-else-if="!isAuth" @click="approveUSDT">授权USDT</div>
      </div>
  </div>
</template>

<script>
import abisell from '@/web3/abisell.json'

export default {
  components: {
  },
  data () {
    return {
        nftAddr:'0x24A63ea5957210ebD6BAC5AD6648d91ebfFad460',
        sellAddr:'0x4483b237FF4C116DEb79a4A76c65E7225B8f9346',
        isAuth:false,
        displayData:this.$route.params.data,
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
        this.$walletFuc.isTokenAddress(this.$usdtAdd, this.sellAddr, Math.pow(10, 18)).then(res => {
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
    async cancelSell(){
        if (!this.walletAddress) {
            this.$toast(this.$t('js.Pleaseconnectyourwallet'))
            return false
        }
        try {
            const cont = this.$contract(abisell, this.sellAddr)
            let value = '0'
            const encodeABI = await cont.methods.cancelSell(this.nftAddr,this.displayData._id).encodeABI()
            const gasPrice = await this.$walletFuc.getGasPrice()
            const gas = await this.$walletFuc.web3EstimateGas(encodeABI, this.sellAddr, gasPrice, value)
            let txHash
            if (this.$walletFuc.connectionMode === 'MetaMask') {
            txHash = await this.$walletFuc.metaMaskSendTransaction(encodeABI, this.sellAddr, gasPrice, gas, value)
            } else if (this.$walletFuc.connectionMode === 'WalletConnect') {
            txHash = await this.$walletFuc.walletConnectSendTransaction(encodeABI, this.sellAddr, gasPrice, gas, value)
            }
            this.$router.push({name: 'home'});
            return Promise.resolve(txHash)
        } catch (err) {
            return Promise.reject(err)
        }
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
            this.$walletFuc.approve(this.$usdtAdd, this.sellAddr).then(res => {
            if (res === '1') {
                this.isAuth = true
            }
            })
        })
    },
    async getnft(){
        if (!this.walletAddress) {
            this.$toast(this.$t('js.Pleaseconnectyourwallet'))
            return false
        }
        this.$toast.loading({
            message: this.$t('js.loading'),
            duration: 0
        })
        try {
            const cont = this.$contract(abisell, this.sellAddr)
            let value = '0'
            const encodeABI = await cont.methods.buy(this.nftAddr,this.displayData._id).encodeABI()
            const gasPrice = await this.$walletFuc.getGasPrice()
            const gas = await this.$walletFuc.web3EstimateGas(encodeABI, this.sellAddr, gasPrice, value)
            let txHash
            if (this.$walletFuc.connectionMode === 'MetaMask') {
            txHash = await this.$walletFuc.metaMaskSendTransaction(encodeABI, this.sellAddr, gasPrice, gas, value)
            } else if (this.$walletFuc.connectionMode === 'WalletConnect') {
            txHash = await this.$walletFuc.walletConnectSendTransaction(encodeABI, this.sellAddr, gasPrice, gas, value)
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
.sbox {
    .br {
        border-radius: 12px;
    }

    .si_img{
        width: 100%;
        height: 300px;
    }

    .mobox {
        padding: 0 9px;

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

        .zpms {
            margin: 15px 0 17px 0;
            font-size: 17px;
            font-weight: 500;
            color: rgba(164,161,161,1);
        }

        .obox {
            margin: 15px 2px;
            .idetail_box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background:rgba(34,83,74,.5);
                width: 100%;
                height: 85px;
                margin: 7px 0;
                .idboxl {
                    margin-left: 10px;
                    .idbn{
                        font-size: 16px;
                        font-weight: 500;
                    }
                    .idbt{
                        margin-top: 10px;
                        font-size: 15px;
                        color: rgba(164,161,161,1);
                    }
                }
                .ir_s1{
                    margin-right: 10px;
                    color: rgb(33, 225, 174);
                    font-size: 21px;
                    font-weight: 400;
                }
            }
        }
    }

    .pbut {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 60px;
        background: rgb(33,225,174);
        color: black;
        font-size: 19px;
        font-weight: 700;
    }
   
}
</style>