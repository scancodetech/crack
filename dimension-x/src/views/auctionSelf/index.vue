<template>
  <div class="cbox">
      <div class="cbpd">
        <div class="obox">
            <!-- tokenid -->
            <div class="idetail_box" v-for="(v,index) in displayData" :key="v.tokenid">
                <div class="id_item" @click="choseOne(index)">
                    <el-image :src="'http://156.236.70.120/ipfs/'+v._urlinfo" lazy class="idi_img"></el-image>
                    <div class="idi_txt name">{{hotnameSub(v.idToName)}}</div>
                    <div class="cboi"><div class="cboii" v-show="chosenOne == index">√</div></div>
                </div>
            </div>
        </div>
        <div class="cb_txt">起拍价格：</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入起拍价格" type="number" v-model="inputoprice" maxlength="100" />
        </div>
        <div class="cb_txt">主题：</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入主题" type="text" v-model="inputTheme" maxlength="100" />
        </div>
        <div class="cb_txt">品牌：</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入品牌" type="text" v-model="inputType" maxlength="100" />
        </div>
        <div class="cb_txt">保证金：</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入保证金" type="number" v-model="inputG" maxlength="100" />
        </div>
        <div class="cb_txt">加价幅度：</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入加价幅度" type="number" v-model="inputF" maxlength="100" />
        </div>
        <div class="cb_txt">周期：</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入周期" type="number" v-model="inputPriod" maxlength="100" />
        </div>
        <!-- <div class="cb_txt">数量：</div>
        <div class="cb_name br eh">
            <input class="input_box" placeholder="请输入卡片描述" type="number" v-model="inputValue" maxlength="100" />
        </div> -->
        <div class="ir_but" @click="auctionBut"  v-if='isAuth'>确认拍卖</div>
        <div class="ir_but" @click='apprveAll()' v-if='!isAuth'>授权</div>
    </div>
  </div>
</template>

<script>
import abinft from '@/web3/abinft.json'
import abiauction from '@/web3/abiauction.json'

export default {
  components: {
  },
  data () {
    return {
        chosenOne:-1,
        nftAddr:'0x24A63ea5957210ebD6BAC5AD6648d91ebfFad460',
        auctionAddr:'0xA0152E3AA2329E8d22DCFd16c90145671428f95F',
        displayData:[],
        isAuth:false,
        inputoprice:'',
        inputTheme:'',
        inputType:'',
        inputG:'',
        inputF:"",
        inputPriod:'',
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
    choseOne(tokenid)
    {
        this.chosenOne = tokenid
    },
    async isApproveAll() {
      const cont =this.$contract(abinft, this.nftAddr)
      cont.methods.isApprovedForAll(this.walletAddress,this.auctionAddr).call().then(res => {
        this.isAuth = res
      })
      return Promise.resolve(true)
    },
    async getNFTitem (contAdd) { 
        var newDis = []
      const cont =this.$contract(abinft, contAdd)
      cont.methods.balanceOf(this.walletAddress).call().then(res1 => {
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
    async auctionBut () {
      if (!this.walletAddress) {
        this.$toast(this.$t('js.Pleaseconnectyourwallet'))
        return false
      }else if(this.chosenOne < 0){
          this.$toast(this.$t('Crossjs.Pleaseenterthe'))
        return false
      }
        var _price = this.$BigNumber(this.inputoprice).multipliedBy(Math.pow(10, 18))
        // var _priceg = this.$BigNumber(this.inputG).multipliedBy(Math.pow(10, 18))
        var _pricef = this.$BigNumber(this.inputF).multipliedBy(Math.pow(10, 18))
      this.$toast.loading({
        message: this.$t('js.loading'),
        duration: 0
      })
      try {
        const cont = this.$contract(abiauction, this.auctionAddr)
        let value = '0'
        let temp = this.displayData[this.chosenOne]
        const encodeABI = await cont.methods.sell(this.nftAddr,temp.tokenid,_price,_pricef,1,
                        temp.idToName,temp.idToUri,this.inputPriod).encodeABI()
        const gasPrice = await this.$walletFuc.getGasPrice()
        const gas = await this.$walletFuc.web3EstimateGas(encodeABI, this.auctionAddr, gasPrice, value)
        let txHash
        if (this.$walletFuc.connectionMode === 'MetaMask') {
          txHash = await this.$walletFuc.metaMaskSendTransaction(encodeABI, this.auctionAddr, gasPrice, gas, value)
        } else if (this.$walletFuc.connectionMode === 'WalletConnect') {
          txHash = await this.$walletFuc.walletConnectSendTransaction(encodeABI, this.auctionAddr, gasPrice, gas, value)
        }

        this.chosenOne=-1
        this.inputoprice = ''
        this.inputTheme = ''
        this.inputType = ''
        this.inputG = ''
        this.inputF = ''
        this.inputPriod = ''
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
            const encodeABI = await cont.methods.setApprovalForAll(this.auctionAddr,true).encodeABI()
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