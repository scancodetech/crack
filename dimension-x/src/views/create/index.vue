<template>
  <div class="cbox">
      <div class="cbpd">
        <div class="cb_txt">上传图片</div>
        <!-- <div v-if="upimg" style="width:100%;position: relative;">
            <img :src="upimg" alt="正在显示"  class="cdimg">
            <img src="~@/assets/imgs/ch.png" class="cdimgb" @click="closeimg()">
        </div> -->
        <el-upload
                action="http://156.236.70.120/ipfsadd/api/v0/add"
                list-type="picture-card"
                ref="upload"
                limit="1"
                :on-success="handlesuccess"
                :on-remove="handleremove">
                <i class="el-icon-plus"></i>
        </el-upload>
        <div class="cb_txt">卡片名字</div>
        <div class="cb_name br">
            <input class="input_box" placeholder="请输入卡片名字" type="text" v-model="inputName" maxlength="100" />
        </div>
        <div class="cb_txt">卡片描述</div>
        <div class="cb_name br eh">
            <input class="input_box" placeholder="请输入卡片描述" type="text" v-model="inputBrand" maxlength="100" />
        </div>
        <div class="ir_but" @click="getNFTIndex">铸造卡片</div>
        <!-- tips -->
        <div class="wb_pop" v-show="opentips" @touchmove.prevent="">
            <div class="wb_wrap"></div>
            <div class="wbp_mbox">
                <div style="transform: translate(0px, 0px); opacity: 1;">
                    <div class="imbox">
                        <div class="center">注意</div>
                        <div class="center imbtext">依据当前平台情况，铸造与赠送会有记账费用，拍卖与上架有撮合费用，注意保持钱包token足够支付相关费用。详情键连接:</div>
                        <div class="center"><div class="imb_b center" @click="readed()">知道了</div></div>
                    <div class="tips center">
                        <van-checkbox v-model="dontReed" checked-color="#21e1ae"></van-checkbox>
                            <span>不再提示</span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import abinft from '@/web3/abinft.json'

export default {
  components: {
  },
  data () {
    return {
        nftAddr:'0x24A63ea5957210ebD6BAC5AD6648d91ebfFad460',
        opentips:true,
        dontReed:false,
        thash:'',
        inputName:'',
        inputBrand:'',


        sss:''
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
  },
  created () {
      this.opentips = !(Boolean(localStorage.getItem('dontread')) || false)
  },
  methods: {
      readed(){
          localStorage.setItem('dontread',this.dontReed?'true':'');
          this.opentips = false;
      },
    //   closeimg(){
    //       this.upimg = ""
    //   },
    //   aftRead(f){
    //       this.upimg = f.content
    //       f.file['path']=''
    //       console.log(f.file)
    //       let fd = new FormData()
    //       fd.append('name',f.file)
    //     //   this.$service.post("http://156.236.70.120/upload/",fd,headers:{'Content-Type': 'multipart/form-data'}).then(res=>{console.log(res)})
    //     //   axios({method:'POST',url:'/ipfsadd/api/v0/add',data:fd,headers:{'Content-Type': 'multipart/form-data'}}).then(res=>{console.log(res)})
    //   },
      handlesuccess(response, file, fileList){
          this.thash = response.Hash
      },
      handleremove(){
          this.thash = ''
      },
      async getNFTIndex () {
      const cont =this.$contract(abinft, this.nftAddr)
      cont.methods.viewTokenID().call().then(res => {
          this.create(res)
      })
      return Promise.resolve(true)
    },
      async create (res) {
        if (!this.walletAddress) {
            this.$toast(this.$t('js.Pleaseconnectyourwallet'))
            return false
        }else if(this.thash == '' || this.inputName == ''){
            this.$toast(this.$t('Crossjs.Pleaseenterthe'))
            return false
        }

        this.$toast.loading({
            message: this.$t('js.loading'),
            duration: 0
        })
        try {
            const cont = this.$contract(abinft, this.nftAddr)
            let value = '0'
            const encodeABI = await cont.methods.mint(this.walletAddress,res,this.inputName,1,this.inputBrand,this.thash).encodeABI()
            const gasPrice = await this.$walletFuc.getGasPrice()
            const gas = await this.$walletFuc.web3EstimateGas(encodeABI, this.nftAddr, gasPrice, value)
            let txHash
            if (this.$walletFuc.connectionMode === 'MetaMask') {
                txHash = await this.$walletFuc.metaMaskSendTransaction(encodeABI, this.nftAddr, gasPrice, gas, value)
            } else if (this.$walletFuc.connectionMode === 'WalletConnect') {
                txHash = await this.$walletFuc.walletConnectSendTransaction(encodeABI, this.nftAddr, gasPrice, gas, value)
            }

            this.inputName = ''
            this.inputBrand = ''

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
            .imbox{
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                margin: 0 auto;
                width: 245px;
                height: 245px;
                border-radius: 30px;
                background-color: rgb(82, 80, 80);
                color: white;
                .imbtext {
                    font-size: 10px;
                    letter-spacing: 2px;
                    line-height: 19px;
                    padding: 0 23px;
                    color: rgb(192, 188, 188);
                    
                }
                .imb_b{
                    background-color:rgb(33, 225, 174);
                    width: 120px;
                    height: 30px;
                    border-radius: 35px;
                    font-size: 10px;
                    font-weight: 600;
                    color: rgb(44, 43, 43);
                    letter-spacing: 1px;
                }
                .tips{
                    >span{
                        margin-left: 7px;
                    }
                }
            }
        }
    }
    
    .cdimg{
        border-radius: 12px;
        width: 100%;
        height: 205px;
    }

    .cdimgb{
        position: relative;
        left: 90%;
        bottom: 196px;
        width: 17px;
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