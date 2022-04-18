<template>
  <div class="pf">
    <div class="pf_top">
      <div class="pf_logo">
        <img src="~@/assets/imgs/logo.png">
        Dimension X
      </div>
      <div class="pf_ibox">
        <img src="~@/assets/imgs/pf1.png">
        <img src="~@/assets/imgs/pf2.png">
        <img src="~@/assets/imgs/pf3.png">
        <img src="~@/assets/imgs/pf4.png">
        <img src="~@/assets/imgs/pf5.png">
      </div>
    </div>
    <div class="pf_copy">© 2022  Copyrigts are Creative Commons</div>
  </div>
</template>

<style lang="scss" scoped>
.pf {
  max-width: 450px;
  margin: 0 auto;
  .pf_top {
    background: #15181B;
    .pf_logo {
      padding: 20px 0 27px;
      text-align: center;
      font-size: 14px;
      color: #21E1AE;
      font-weight: 500;
      >img {
        margin: 0 6px 0;
        width: 22px;
      }
    }
    .pf_ibox {
      padding: 0 0 23px;
      display: flex;
      align-items: center;
      justify-content: center;
      >img {
        margin: 0 7px;
        width: 26px;
      }
    }
  }
  .pf_copy {
    border-top: 1px solid #2F2F2F;
    font-size: 10px;
    text-align: center;
    padding: 15px 0;
    background: #15181B;
    color: #A4A4A4;
  }
}
</style>
