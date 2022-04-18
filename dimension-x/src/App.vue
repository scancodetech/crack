<template>
  <div id="app">
    <pageHead></pageHead>
    <router-view class="app_main" />
    <pageFoot></pageFoot>
  </div>
</template>

<script>
import pageHead from '@/components/pagehead/index.vue'
import pageFoot from '@/components/pagefoot/index.vue'

export default {
  components: {
    pageHead,
    pageFoot,
  },
}
</script>

<style lang="scss">
#app{
  min-height: 100vh;
  background: url('~@/assets/imgs/bg.png') no-repeat;
  background-size: 100%;
  .app_main {
    padding: 15px 10px;
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    overflow: hidden;
  }
}
</style>