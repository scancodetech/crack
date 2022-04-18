<template>
  <div class="pi">
    <div class="pi_box">
        <div class="pi_item">{{item1}}</div>
        <div class="pi_item">{{item2}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ["item1","item2"],
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.pi {
    // border-radius: 240px;
    background: rgba(0,0,0,1);
    .pi_box{
        // background: red;
        .pi_item{
            padding: 6px 10px;
        }
    }
}

</style>
