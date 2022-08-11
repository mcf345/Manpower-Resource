<template>
  <el-dropdown @command="changeLanguage">
    <div>
      <svg-icon style="color: #fff;font-size: 26px" icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="$i18n.locale === 'zh'" command="zh">
          中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="$i18n.locale === 'en'" command="en">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'Lang',
  methods: {
    changeLanguage(lan) {
      // console.log(lan)
      this.$message.success('切换语言成功!')
      Cookies.set('lang', lan)
      this.$i18n.locale = lan
    }
  }
}
</script>

<style scoped lang="scss"></style>
