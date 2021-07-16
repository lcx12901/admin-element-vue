<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      
    }
  }

}
</script>

<style lang="less">
  @import 'assets/css/base.css';
  @import 'assets/css/iconfont.css';
  #nprogress .bar {
    background: linear-gradient(to right, #6337ac, #0185fc) !important; //自定义颜色
    height: 10px;
  }

</style>
