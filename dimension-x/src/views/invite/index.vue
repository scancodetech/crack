<template>
  <div class="ibox">
      <div class="fri br">
        <div class="pg_inv">
            <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 好友
        </div>
        <div class="textbox_msg br">
            <input class="input_box" placeholder="请输入关键字搜索" type="text" v-model="inputValue" maxlength="100" />
        </div>
        <div class="com_but br">确认</div>
        <div class="scbox br">
            <div class="sc_s1">hgfh123</div>
            <div class="sc_s2">我的邀请码</div>
        </div>
        <div class="cpybox">
            <div class="cpyi br">复制邀请码</div>
        </div>
      </div>
      <div class="inr br">
          <div class="pg_inv">
            <img src="~@/assets/imgs/pg_tit.png" class="pgt_ibox"> 邀请收益
        </div>
        <div class="irbox">
            <div class="ir_s1">{{$toFixed(123456)}} U</div>
            <div class="ir_s2">可领取收益</div>
        </div>
        <div class="ir_but">领取收益</div>
      </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
    walletAddress() {}
  },
  created () {
    // this.init()
    // this.setTimer()
  },
  methods: {
    setTimer () {
       if (this.timerFn) {
        clearInterval(this.timerFn)
      }
      this.timerFn = setInterval(() => {
        this.init()
      }, this.$timer)
    },
    init () {
      if (this.walletAddress) {
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.ibox {
    // padding: 17px 16px;
    .br {
        border-radius: 12px;
    }

    .pg_inv {
            font-size: 16px;
            font-weight: 500;
            display: flex;
            align-items: flex-end;
            .pgt_ibox {
            margin-right: -8px;
            width: 28px;
        }
    }

    .fri{
        background: rgba(32, 57, 62, 1);
        margin: 5px 6px;
        padding: 15px 12px 1px 12px;

        .textbox_msg {
            display: flex;
            flex-direction:row;
            justify-content: space-between;
            padding: 5px 30px;
            background:rgba(34,83,74,1);
            margin: 13px 0;
            .input_box {
                border: none;
                background: none;
                color:rgba(255,255,255,0.7);
                width: 100%;
                height: 37px;
                font-size: 15px;
            }
        }

        .com_but {
            background:rgba(33,225,174,1);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 30px;
            height: 50px;
            color: black;
            font-size: 20px;
            font-weight: 550;
        }

        .scbox{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background:rgba(34,83,74,1);
            margin-top: 30px;
            height: 120px;
            .sc_s1{
                font-size: 27px;
                font-weight: 600;
                margin-bottom: 19px;
            }
            .sc_s2{
                font-size: 10px;
                color: rgba(164,161,161,1);

            }
        }

        .cpybox {
            display: flex;
            justify-content: center;
            margin: 30px 0;
            .cpyi{
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid rgba(27,163,131,1);
                color: rgb(27,163,131);
                height: 36px;
                width: 35%;
                font-size: 13px;
            }
        }
    }

    .inr{
        background: rgba(32, 57, 62, 1);
        margin: 5px 6px;
        padding: 15px 12px 1px 12px;
        .irbox{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            // background:rgba(34,83,74,1);
            height: 120px;
            .ir_s1{
                color: rgb(33,225,174);
                font-size: 27px;
                font-weight: 600;
                margin-bottom: 19px;
            }
            .ir_s2{
                font-size: 10px;
                color: rgba(164,161,161,1);

            }
        }
        .ir_but {
            border-radius: 30px;
            background:rgba(33,225,174,1);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 50px;
            width: 60%;
            color: black;
            font-size: 20px;
            font-weight: 550;
            margin: 0 auto;
            margin-bottom: 30px;
        }
    }

}
</style>