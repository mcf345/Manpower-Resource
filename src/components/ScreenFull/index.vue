<template>
  <!-- 放置一个图标 -->
  <!-- 放置一个svg的图标 -->
  <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
</template>

<script>
import screenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  methods: {
    //   改变全屏
    changeScreen() {
      if (!screenFull.isEnabled) {
        // 此时全屏不可用
        this.$message.warning('此时全屏组件不可用')
        return
      }
      // document.documentElement.requestFullscreen()  原生js调用
      //   如果可用 就可以全屏
      screenFull.toggle()
    }
  }
}
</script>

<style>

</style>

