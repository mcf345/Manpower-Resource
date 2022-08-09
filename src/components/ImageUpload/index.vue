<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :class="{complete:isCompleted}"
      :limit="1"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-progress v-if="showPercent" :percentage="percentage" style="width: 200px;" />
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDeU9YibDYdWGl11lFTR9crrb5JRJwKTMz',
  SecretKey: 'PYS6VfaFengKo56qJVQ4RYOwDEyR3Seb'
})
// 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了

export default {
  name: 'ImageUpload',
  data() {
    return {
      showPercent: false, // 进度条
      percentage: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      // 指定默认图片
      fileList: [
        {
          url: 'https://img1.baidu.com/it/u=3506302877,1023118610&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        }
      ]
    }
  },
  computed: {
    isCompleted() {
      return this.fileList.length >= 1
    }
  },
  methods: {
    changeFile(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      // file上传文件的对象
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // 判断上传的文件类型是否在规定的范围内
      if (!types.includes(file.type)) {
        this.$message.error('文件类型不匹配')
        return false
      }

      // 判断文件大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件太大了')
        return false
      }

      this.showPercent = true
    },
    upload({ file }) {
      console.log(file)
      if (!file) return
      // 如果上传的文件对象不存在，终止执行
      cos.putObject({
        Bucket: 'my-first-1313213539', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        onProgress: ({ percent }) => {
          this.percentage = percent * 100
        }
      }, (err, data) => {
        if (err) {
          return this.$message.error(err?.methods || '上传出错了')
        }
        // console.log(this.fileList)
        this.fileList.forEach(item => {
          if (item.uid === file.uid) {
            item.uid = `http://${data.Location}`
            // 只有成功获取到了服务器端图片链接的时候，加一个标识
            // 目的：提交更新的时候，进行判断，如果当前文件对象里面没有upload属性，不进行提交
            item.upload = true
          }
        })
        // 上传成功了
        // 关闭进度条
        // 延时把进度条关闭 >> 看到动画效果
        setTimeout(() => {
          this.showPercent = false
          // 进度条清零
          this.percentage = 0
        }, 2000)
      })
    }
  }
}
</script>

<style scoped lang="scss">
 .complete {
   ::v-deep .el-upload--picture-card {
      display: none;
   }
 }
</style>
