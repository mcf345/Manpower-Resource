<template>
  <div>
    <el-card class="container">
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <el-form ref="formRef" label-width="120px" class="form" :model="formData" :rules="rules">
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="formData.username" style="width: 30%;" />
            </el-form-item>
            <el-form-item label="密码:" prop="password2">
              <el-input v-model="formData.password2" style="width: 30%;" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="upDateUserInfo">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <component :is="UserInfo" />
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <component :is="JobInfo" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from '../user-info'
import JobInfo from '@/views/employees/components/job-info'
export default {
  components: { UserInfo, JobInfo },
  props: {},
  data() {
    return {
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度在 6 到 16 位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      this.formData = await getUserDetailById(this.$route.params.id)
    },
    async upDateUserInfo() {
      await this.$refs.formRef.validate()
      await this.$confirm('确定更新？')
      try {
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2
        })
        this.$message.success('更新成功')
      } catch (e) {
        this.$message.error(e.message || '更新失败')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 20px;
  .form {
    margin: 30px 20px 20px 120px;
  }
}
</style>
