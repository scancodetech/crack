<template>
  <div class="homei">
    <div class="textbox_msg">
      <input class="input_box" placeholder="请输入关键字搜索" type="text" v-model="inputValue" maxlength="100" />
    </div>
    <div class="popover_box">
        <div @click="sitem(1)">
            <van-popover placement="bottom" v-model="showPopover1" :actions="actions" @select="onSelect" class="popover_item" >
            <template #reference>
                <van-button type="primary">类别<i class="dowm_icon"></i></van-button>
            </template>
            </van-popover>
        </div>
        <div @click="sitem(2)">
            <van-popover placement="bottom" v-model="showPopover2" :actions="actions2" @select="onSelect" class="popover_item">
            <template #reference>
                <van-button type="primary">价格<i class="dowm_icon"></i></van-button>
            </template>
            </van-popover>
        </div>
        <div @click="sitem(3)">
            <van-popover placement="bottom" v-model="showPopover3" :actions="actions3" @select="onSelect" class="popover_item">
            <template #reference>
                <van-button type="primary">上架时间<i class="dowm_icon"></i></van-button>
            </template>
            </van-popover>
        </div>
    </div>
    <div class="obox">
        <div class="idetail_box" v-for="(v,index) in displayData" :key="v._id">
            <div class="id_item" @click="fun(index)">
                <el-image :src="'http://156.236.70.120/ipfs/'+v._urlinfo" lazy class="idi_img"></el-image>
                <div class="idi_txt name">{{hotnameSub(v._nameinfo)}}</div>
                <div class="idi_txt pic">{{$toFixed($BigNumber(v._price).dividedBy(Math.pow(10, 18)))}}U</div>
            </div>
        </div>
    </div>
    <div class="viewlot" v-if="!showalot"><span @click="showlots()">点击显示更多</span></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        inputValue:'',
        showPopover1:false,
        showPopover2:false,
        showPopover3:false,
        showalot:false,
        currank:0,
        actions : [
            { text: '类别一' ,value:1},
            { text: '类别二' ,value:2},
        ],
        actions2 : [
            { text: '价格由低到高' ,value:3},
            { text: '价格由高到低' ,value:4},
        ],
        actions3 : [
            { text: '上架时间正序' ,value:5},
            { text: '上架时间逆序' ,value:6},
        ],
    }
  },
  props:[
    'params','fun'
  ],
  computed:{
      displayData(){
          let res = this.params.filter((p)=>{
              return p._nameinfo.indexOf(this.inputValue) !== -1
          })

          if(this.currank == 3)
          {
              res.sort(this.compareprice("_price",true))
          }else if(this.currank == 4)
          {
              res.sort(this.compareprice("_price",false))
          }else if(this.currank == 5)
          {
            res.sort(this.compareprice("_timeinfo",true))
          }else if(this.currank == 6)
          {
            res.sort(this.compareprice("_timeinfo",false))
          }
        
          if(!this.showalot && res.length > 4)
          {
              res.splice(4);
          }

          return res
      }
  },
  methods: {
    sitem(v){
      this["showPopover"+v] = true;
    },
    hotnameSub(name){
      if(name.length > 6)
      {
        return name.substr(0,8)+"..."
      }
      return name
    },
    onSelect(a){
        this.currank = a.value
    },
    compareprice(prop,dp){
      return function(a,b){
        var v1=a[prop];
        var v2 = b[prop];
        if(!isNaN(Number(v1))&& !isNaN(Number(v2)))
        {
          v1 = Number(v1);
          v2 = Number(v2);
          v1 = dp?v1:-v1;
          v2 = dp?v2:-v2;
        }

        if(v1<v2)
        {
          return -1;
        }else if(v1>v2)
        {
          return 1;
        }else{
          return 0;
        }
      }
    },
    showlots(){
        this.showalot = true;
    },
  }
}
</script>

<style lang="scss" scoped>
.homei {
    .textbox_msg {
      display: flex;
      flex-direction:row;
      justify-content: space-between;
      // flex: 1;
      padding: 5px 30px;
      background:rgba(255,255,255,0.05);
      border-radius: 24px;
      .input_box {
        border: none;
        background: none;
        color:rgba(255,255,255,0.7);
        width: 100%;
        height: 32px;
      }
  }

  .popover_box {
            display: flex;
            justify-content: space-between;
            padding: 20px 0 5px 30px;
            font-size: 16px;
            color: rgba(255,255,255,.7);
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
            background:rgba(33, 225, 174, 0.07);
            width: 46%;
            height: 250px;
            margin: 5px 0;
            border-radius: 13px;
            .idi_img {
                width: 85%;
                height: 175px;
                margin: 15px 15px 0 15px;
            }
            .idi_txt{
                display: flex;
                justify-content: center;
                margin-top: 10px;
            }
            .name {
                color: #A4A4A4;
                font-size: 13px;
            }
            .pic {
                font-size: 16px;
                color: #21E1AE;
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
