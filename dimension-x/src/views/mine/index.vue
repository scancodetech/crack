<template>
  <div class="mbox">
    <div class="mobox">
          <div class="mtl">
              <img src="~@/assets/imgs/home_pg.png" class="tr_i">
              <div class="mtlbox">
                <div>Nns official</div>
                <div class="mtlba">{{walletAddress.substr(0,10)}}...{{walletAddress.substring(walletAddress.length - 4)}}</div>
              </div>
          </div>
          <img src="~@/assets/imgs/yz.png" @click="$router.push({name: 'setting'})" class="mobox_r">
    </div>
    <div class="sibox br">
          <div class="si_i">简介:  <span class="si_o">{{'测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试'}}</span></div>
    </div>
    <div class="itembox">
      <div class="item_l">
        <div :class="itemSelected == 1?'item_s':'item_ns'" @click="itemSelected = 1;displayData = displayDataz">藏品</div>
        <div :class="itemSelected == 2?'item_s':'item_ns'" @click="itemSelected = 2;displayData = displayDatas">已发布</div>
        <div :class="itemSelected == 3?'item_s':'item_ns'" @click="itemSelected = 3;displayData = []">已卖出</div>
      </div>
      <div @click="showPopover = !showPopover" class="item_r" >
        <van-popover placement="bottom" v-model="showPopover" :actions="actions" @select="onSelect">
          <template #reference>
              <van-button type="primary">卡片管理<i class="down_icons"></i></van-button>
          </template>
        </van-popover>
      </div>
    </div>

    <div class="obox">
        <div class="idetail_box" v-for="v in displayData" :key="v._id">
            <div class="id_item">
                <el-image :src="'http://156.236.70.120/ipfs/'+v._urlinfo" lazy class="idi_img"></el-image>
                <div class="idi_txt name">{{hotnameSub(v._nameinfo)}}</div>
            </div>
        </div>
    </div>
    <!-- <div class="viewlot" v-if="!showalot"><span @click="showlots()">点击显示更多</span></div> -->
  </div>
</template>

<script>
import abisell from '@/web3/abisell.json'
import abinft from '@/web3/abinft.json'

export default {
  components: {
  },
  data () {
    return {
      sellAddr:'0x4483b237FF4C116DEb79a4A76c65E7225B8f9346',
      nftAddr:'0x24A63ea5957210ebD6BAC5AD6648d91ebfFad460',
      showPopover:false,
      actions : [
            { text: '铸造卡片' ,value:1},
            { text: '上架卡片' ,value:2},
            { text: '拍卖卡片' ,value:3},
            { text: '赠送卡片' ,value:4},
        ],
      itemSelected:1,
      displayData:[],
      displayDataz:[],
      displayDatas:[],
    }
  },
  computed: {
    walletAddress:{
      get () {
        return this.$walletFuc.walletAddress
      }
    }
  },
  watch: {
    walletAddress(){
      this.init()
    }
  },
  created () {
    this.init()
    // this.setTimer()
  },
  methods: {
    hotnameSub(name){
      if(name.length > 6)
      {
        return name.substr(0,8)+"..."
      }
      return name
    },
    onSelect(a)
    {
      if(a.value == 1)
      {
        this.$router.push({name: 'create'})
      }else if(a.value == 2)
      {
        this.$router.push({name: 'sellcard'})
      }else if(a.value == 3)
      {
        this.$router.push({name: 'auctionSelf'})
      }else{
        this.$router.push({name: 'transfer'})
      }
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
                    temp['_id'] = res2
                    temp['idToDescribe'] = res3['idToDescribe']
                    temp['_nameinfo'] = res3['idToName']
                    temp['idToUri'] = res3['idToUri']
                    newDis.push(temp)
                })
            })
        }
      })
      this.displayDataz = newDis
      return Promise.resolve(true)
    },
    async getsellinfo (contAdd) { 
      const cont =this.$contract(abisell, contAdd)
      var newDis = []
      cont.methods.itemNum().call().then(res => {
        for(let i=0;i<res;i++)
        {
          cont.methods.getItems(i).call().then(res1 => {
              let temp = {}
              temp['_brand'] = res1['_brand']
              temp['_id'] = res1['_id']
              temp['_price'] = res1['_price']
              temp['_timeinfo'] = res1['_timeinfo']
              temp['_nameinfo'] = res1['_nameinfo']
              temp['_urlinfo'] = res1['_urlinfo']
              cont.methods._nftSellerInfo(this.nftAddr,res1['_id']).call().then(res2 => {
                  if(res2.toLowerCase() == this.walletAddress)
                    newDis.push(temp)
              })
          })
        }
      })
      this.displayDatas = newDis
      return Promise.resolve(true)
    },
    init(){
      this.getNFTitem(this.nftAddr)
      this.getsellinfo(this.sellAddr)
      this.displayData = this.itemSelected == 1?this.displayDataz:this.displayDatas
    }
  }
}
</script>


<style lang="scss" scoped>
.mbox {
  .br {
          border-radius: 12px;
      }

  .mobox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // background:rgba(34,83,74,.5);
      width: 100%;
      margin: 7px 0;
      // padding: 0 7px 0 12px;
      .mtl {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin: 7px 0;
        .tr_i{
          width: 60px;
          height: 60px;
          border-radius: 60px;
          border: 1px solid rgb(33,225,174);
          margin-right: 9px;
        }
        .mtlbox{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          height: 60px;
          .mtlba{
            margin-top: 10px;
            font-size: 12px;
            font-weight: 500;
            color: rgba(164,161,161,1);
          }
        }
      }
      .mobox_r{
        margin-right: 10px;
        width: 27px;
      }
  }

  .sibox{
        background:rgba(34,83,74,.5);
        margin-top: 16px;
        font-size: 13px;
        padding: 15px;
        letter-spacing: 2px;
        .si_o{
             color: rgba(164,161,161,1);
         }
         .si_i{
            color: white;
         }
    }

    .itembox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      letter-spacing: 2px;
      margin-top: 15px;
      .item_l{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 50px;
        padding-left: 15px;
        >div {
          margin-right: 23px;
          display: flex;
          align-items: center;
        }
        .item_s{
          color: rgb(33,225,174);
          font-weight: 700;
          height: 35px;
          border-bottom: 3px solid rgb(33,225,174);
        }
        .item_ns{
          color: rgba(164,161,161,1);
        }
      }
      .item_r{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-weight: 600;
        color: rgb(26, 29, 29);
        background-color: rgb(33,225,174);
        height: 26px;
        border-radius: 13px;
        width: 86px;
        .down_icons{
          display: inline-block;
          width: 8px;
          height: 5px;
          border-top: 8px solid rgba(26, 29, 29,.7);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
        }
      }
    }

    .obox {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 0 10px;
        .idetail_box:nth-child(odd){
            margin-right: 24px;
        } 
        .idetail_box {
            display: flex;
            background: rgba(33, 225, 174, 0.07);
            width: 46%;
            height: 250px;
            margin: 5px 0;
            border-radius: 13px;
            .idi_img {
                width: 85%;
                height: 175px;
                margin: 15px 15px 0 12px;
            }
            .name {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 20px;
                color: #A4A4A4;
                font-size: 13px;
            }
        }
    }

    .viewlot{
        display: flex;
        justify-content: center;
        color: #A4A4A4;
        font-size: 15px;
        padding: 9px 0;
    }
}
</style>