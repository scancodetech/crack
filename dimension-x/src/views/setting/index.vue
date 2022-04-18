<template>
  <div class="setbox">
      <div class="sobox">
            <div class="obox br ih">
                <div class="tc">头像</div>
                <div class="tr">
                    <img src="~@/assets/imgs/home_pg.png" class="tr_i">
                    <i class="right_icon"></i>
                </div>
            </div>
            <div class="obox br nh">
                <div class="tc">昵称</div>
                <div class="tr">
                    <i class="right_icon"></i>
                </div>
            </div>
            <div class="obox br nh">
                <div class="tc">手机</div>
                <div class="gr">
                    未绑定手机
                </div>
            </div>
            <div class="obox br nh">
                <div class="tc">地址</div>
                <div class="gr">
                    {{walletAddress.substr(0,9)}}...{{walletAddress.substring(walletAddress.length - 4)}}
                </div>
            </div>
            <div class="obox br nh">
                <div class="tc">简介</div>
                <div class="tr">
                    <i class="right_icon"></i>
                </div>
            </div>
            <div class="obox br nh">
                <div class="tc">收款地址</div>
                <div class="tr">
                    <i class="right_icon"></i>
                </div>
            </div>
      </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
        testData:'65ASD4AS456D4AS6F44S65F46ASFASA'
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
  },
  created () {
  },
  methods: {
      
  }
}
</script>


<style lang="scss" scoped>
.setbox {
    .br {
        border-radius: 12px;
    }

    .right_icon {
        display: inline-block;
        width: 5px;
        height: 8px;
        border-left: 8px solid rgba(255,255,255,.7);
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        margin:0 5px;
    }

    .sobox {
        .obox {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background:rgba(34,83,74,.5);
            width: 100%;
            margin: 7px 0;
            padding: 0 7px 0 12px;
            .tr {
                .tr_i{
                    width: 46px;
                    height: 46px;
                    border-radius: 46px;
                    margin-right: 9px;
                }
            }
            .gr{
                font-size: 13px;
                color: rgba(164,161,161,1);
                margin-right: 5px;
            }
        }
        .ih {
            height: 70px;
        }
        .nh {
            height: 50px;
        }
    }
}
</style>