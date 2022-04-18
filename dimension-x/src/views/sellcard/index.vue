<template>
  <div class="cbox">
      <div class="cbpd">
        <div class="obox">
            <!-- tokenid -->
            <div class="idetail_box" v-for="(v,index) in displayData" :key="v.tokenid">
                <div class="id_item" @click="choseOne(index)">
                    <el-image :src="'http://156.236.70.120/ipfs/'+v._urlinfo" lazy class="idi_img"></el-image>
                    <div class="idi_txt name">{{hotnameSub(v.idToName)}}</div>
                    <div class="cboi"><div class="cboii" v-show="chosenIndex == index">√</div></div>
                </div>
            </div>
        </div>
        <div class="cb_txt">价格：</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入价格" type="number" v-model="inputPrice" maxlength="100" />
        </div>
        <div class="cb_txt">主题：</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入主题" type="text" v-model="inputTheme" maxlength="100" />
        </div>
        <div class="cb_txt">品牌：</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入品牌" type="text" v-model="inputType" maxlength="100" />
        </div>
        <!-- <div class="cb_txt">数量：</div>
        <div class="cb_name br eh">
            <input class="input_box" placeholder="请输入卡片描述" type="number" v-model="inputValue" maxlength="100" />
        </div> -->
        <div class="ir_but" @click='sellBut()' v-if='isAuth'>上架</div>
        <div class="ir_but" @click='apprveAll()' v-if='!isAuth'>授权</div>
    </div>
  </div>
</template>

<script>
import abinft from '@/web3/abinft.json'
import abisell from '@/web3/abisell.json'

export default {
  components: {
  },
  data () {
    return {
        chosenIndex:-1,
        nftAddr:'0x24A63ea5957210ebD6BAC5AD6648d91ebfFad460',
        sellAddr:'0x4483b237FF4C116DEb79a4A76c65E7225B8f9346',
        displayData:[],
        inputPrice:'',
        inputTheme:'',
       inputType:'',
       isAuth:false,
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
      this.isApproveAll()
      this.getNFTitem(this.nftAddr)
    }
  },
  created () {
      this.isApproveAll()
      this.getNFTitem(this.nftAddr)
  },
  methods: {
    hotnameSub(name){
        if(name.length > 6)
        {
            return name.substr(0,8)+"..."
        }
        return name
    },
    choseOne(index)
    {
        this.chosenIndex = index
    },
    async isApproveAll() {
      const cont =this.$contract(abinft, this.nftAddr)
      cont.methods.isApprovedForAll(this.walletAddress,this.sellAddr).call().then(res => {
        this.isAuth = res
      })
      return Promise.resolve(true)
    },
    async getNFTitem (contAdd) { 
        var newDis = []
      const cont =this.$contract(abinft, contAdd)
      cont.methods.balanceOf(this.walletAddress || this.$zeroAdd).call().then(res1 => {
        for(let i=0;i<res1;i++)
        {
            cont.methods.ownerToIds(this.walletAddress,i).call().then(res2 => {
               cont.methods.all(res2).call().then(res3 => {
                    let temp = {}
                    temp['tokenid'] = res2
                    temp['idToDescribe'] = res3['idToDescribe']
                    temp['idToName'] = res3['idToName']
                    temp['idToUri'] = res3['idToUri']
                    newDis.push(temp)
                })
            })
        }
      })
      this.displayData = newDis
      return Promise.resolve(true)
    },
    async sellBut () {
      if (!this.walletAddress) {
        this.$toast(this.$t('js.Pleaseconnectyourwallet'))
        return false
      }else if(this.chosenIndex < 0){
          this.$toast(this.$t('Crossjs.Pleaseenterthe'))
        return false
      } else if (!this.inputPrice || !/^\d+(\.\d+)?$/.test(this.inputPrice)) {
        this.$toast(this.$t('Crossjs.Pleaseenterthe'))
        return false
      }
        var _price = this.$BigNumber(this.inputPrice).multipliedBy(Math.pow(10, 18))
      this.$toast.loading({
        message: this.$t('js.loading'),
        duration: 0
      })
      try {
        const cont = this.$contract(abisell, this.sellAddr)
        let value = '0'
        let temp = this.displayData[this.chosenIndex]
        const encodeABI = await cont.methods.sell(this.nftAddr,temp.tokenid,_price,1,
                        temp.idToName,temp.idToUri,temp.idToDescribe).encodeABI()
        const gasPrice = await this.$walletFuc.getGasPrice()
        const gas = await this.$walletFuc.web3EstimateGas(encodeABI, this.sellAddr, gasPrice, value)
        let txHash
        if (this.$walletFuc.connectionMode === 'MetaMask') {
          txHash = await this.$walletFuc.metaMaskSendTransaction(encodeABI, this.sellAddr, gasPrice, gas, value)
        } else if (this.$walletFuc.connectionMode === 'WalletConnect') {
          txHash = await this.$walletFuc.walletConnectSendTransaction(encodeABI, this.sellAddr, gasPrice, gas, value)
        }

        this.chosenIndex=-1
        this.inputPrice=''
        this.inputTheme=''
        this.inputType=''
        setTimeout(() => {
          this.getNFTitem(this.nftAddr)
        }, this.$timer)

        return Promise.resolve(txHash)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async apprveAll(){
        if (!this.walletAddress) {
            this.$toast(this.$t('js.Pleaseconnectyourwallet'))
            return false
        }
        this.$toast.loading({
            message: this.$t('js.loading'),
            duration: 0
        })
        try {
            const cont = this.$contract(abinft, this.nftAddr)
            let value = '0'
            const encodeABI = await cont.methods.setApprovalForAll(this.sellAddr,true).encodeABI()
            const gasPrice = await this.$walletFuc.getGasPrice()
            const gas = await this.$walletFuc.web3EstimateGas(encodeABI, this.nftAddr, gasPrice, value)
            let txHash
            if (this.$walletFuc.connectionMode === 'MetaMask') {
                 txHash = await this.$walletFuc.metaMaskSendTransaction(encodeABI, this.nftAddr, gasPrice, gas, value)
            } else if (this.$walletFuc.connectionMode === 'WalletConnect') {
                txHash = await this.$walletFuc.walletConnectSendTransaction(encodeABI, this.nftAddr, gasPrice, gas, value)
            }
            this.isAuth = true
            return Promise.resolve(txHash)
        } catch (err) {
            return Promise.reject(err)
        }
    },
  }
}
</script>


<style lang="scss" scoped>
.cbox {
    .br{
        border-radius: 12px;
    }

    .cbpd{
        padding: 0 15px;
    }

    .center{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .cb_txt{
        margin: 10px 0;
        font-size: 10px;
        color: rgb(199, 197, 197);
        letter-spacing: 2px;
    }

    .obox {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .idetail_box:nth-child(odd){
            margin-right: 10px;
        } 
        .idetail_box {
            display: flex;
            background: rgba(33, 225, 174, 0.07);
            width: 47%;
            height: 250px;
            margin: 5px 0;
            border-radius: 13px;
            .id_item {
                position: relative;
                .cboi{
                    position: relative;
                    left: 78%;
                    bottom: 85%;
                    background: rgba(24, 167, 129, 0.9);
                    width: 23px;
                    height: 23px;
                    border-radius: 100%;
                    .cboii{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 16px;
                        width: 100%;
                        height: 100%;
                        border-radius: 100%;
                        background: rgb(33,225,174);
                    }
                }
            }
            .idi_img {
                width: 85%;
                height: 185px;
                margin: 15px 15px 0 15px;
            }
            .idi_txt{
                display: flex;
                justify-content: center;
                margin-top: 17px;
            }
            .name {
                color: #A4A4A4;
                font-size: 13px;
            }
        }
    }

    .cb_name{
        display: flex;
        flex-direction:row;
        justify-content: space-between;
        // flex: 1;
        padding: 5px 11px;
        background: rgba(33, 225, 174, 0.07);
        font-size: 13px;
        .input_box {
            border: none;
            background: none;
            color:rgba(255,255,255,0.7);
            width: 100%;
            height: 32px;
      }
    }

    .eh{
        height: 72px;
    }

    .ir_but {
            border-radius: 30px;
            background: #21e1ae;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 39px;
            width: 60%;
            color: black;
            font-size: 16px;
            font-weight: 550;
            margin: 0 auto;
            margin-top: 19px;
        }
}
</style>