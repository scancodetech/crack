<template>
  <div class="hm">
    <div class="hm_ban">
      <img src="~@/assets/imgs/home_pg.png">
    </div>
    <div class="pg_tit">
      <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 热门
    </div>
    <div class="hm_hot">
      <!-- :autoplay="3000" -->
      <van-swipe :showIndicators="false" :loop="false" width="160">  
        <van-swipe-item>
          <div class="hmh_wrap">
            <div class="pg_item">
              <img src="~@/assets/imgs/home_pg.png" class="pg_img">
              <div class="name">{{hotnameSub(hotnametest)}}</div>
              <div class="pic">{{$toFixed(hotprice)}}U</div>
            </div>
          </div>
        </van-swipe-item>
        
      </van-swipe>
    </div>
    <div class="pg_tit">
      <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 市场
    </div>
    <storeitem :params="displayDataSell" :fun='testFun1'/>
    <div class="pg_tit">
      <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 拍卖
    </div>
    <storeitem :params="displayDataAuction" :fun='testFun2'/>
  </div>
</template>

<script>
import storeitem from '@/views/home/store.vue'
import abisell from '@/web3/abisell.json'
import abiauction from '@/web3/abiauction.json'

export default {
  components: {
    storeitem
  },
  data () {
    return {
      sellAddr:'0x4483b237FF4C116DEb79a4A76c65E7225B8f9346',
      auctionAddr:'0xA0152E3AA2329E8d22DCFd16c90145671428f95F',
      nftAddr:'0x24A63ea5957210ebD6BAC5AD6648d91ebfFad460',
      displayDataSell:[],
      displayDataAuction:[],

      //---------------------------------------------------
      hotnametest:"WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      hotprice:123456789,
      testData:[{name:"1111",price:"456"},{name:"33333",price:"123"},{name:"222222",price:"789"},{name:"222222",price:"789"},{name:"222222",price:"789"},{name:"222222",price:"789"}],
    }
  },
  computed: {
    testFun1(){
      return this.test1
    },
    testFun2(){
      return this.test2
    },


    walletAddress:{
      get () {
        return this.$walletFuc.walletAddress
      }
    }
  },
  watch: {
  },
  created () {
    this.getsellinfo(this.sellAddr)
    this.getauctioninfo(this.auctionAddr)
    // this.init()
    // this.setTimer()
  },
  methods: {
    test1(index){
      this. $router.push({name: 'storeItem',params:{data:this.displayDataSell[index]}});
    },
    test2(index){
      this. $router.push({name: 'auction',params:{data:this.displayDataAuction[index]}});
    },
    hotnameSub(name){
      if(name.length > 6)
      {
        return name.substr(0,8)+"..."
      }
      return name
    },

    // ---------------------------------
    // setTimer () {
    //    if (this.timerFn) {
    //     clearInterval(this.timerFn)
    //   }
    //   this.timerFn = setInterval(() => {
    //     this.init()
    //   }, this.$timer)
    // },
    // init () {
      // this.getsellinfo(this.storeAddr)
    // },
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
                  temp['sellAddr'] = res2
                  newDis.push(temp)
              })
          })
        }
      })
      this.displayDataSell = newDis
      return Promise.resolve(true)
    },
    async getauctioninfo (contAdd) { 
      const cont =this.$contract(abiauction, contAdd)
      var newDis = []
      cont.methods.itemNum().call().then(res => {
        for(let i=0;i<res;i++)
        {
          cont.methods.getItems(i).call().then(res1 => {
              let temp = {}
              temp['_brand'] = res1['_brand']
              temp['_amplitude'] = res1['_amplitude']
              temp['_id'] = res1['_id']
              temp['_lastcallaccount'] = res1['_lastcallaccount']
              temp['_price'] = res1['_price']
              temp['_timeinfo'] = res1['_timeinfo']
              temp['_endtimeinfo'] = res1['_endtimeinfo']
              temp['_nameinfo'] = res1['_nameinfo']
              temp['_urlinfo'] = res1['_urlinfo']
              newDis.push(temp)
          })
        }
      })
      this.displayDataAuction = newDis
      return Promise.resolve(true)
    },
  }
}
</script>


<style lang="scss" scoped>
.hm {
  .pg_tit {
    padding: 25px 0 15px;
  }
  .hm_ban {
    >img {
      width: 100%;
    }
  }
  .hm_hot {
    .hmh_wrap {
      margin: 0 5px;
      .pg_img {
        width: 85%;
        height: 75%;
        padding: 15px;
      }
    }
  }
}
</style>