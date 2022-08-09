<template>
  <el-dialog :visible="isShowAddDept" :title="`${showTitle}部门 [ ${formData.name} ]`" @close="close">
    <el-form ref="form" label-width="100px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>

      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>

      <el-form-item label="部门负责人" prop="manager">
        <!--        <el-input v-model="formData.manager" />-->
        <el-select v-model="formData.manager" placeholder="请选择" style="width: 80%;" @focus="getEmployeeSimple">
          <el-option
            v-for="item in options"
            :key="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="close">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { addDepartments, getDepartDetail, getDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  name: 'AddDept',
  components: {},
  props: {
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rule, value) => {
      // 需求是什么
      // 当前输入的name值 是否根同级的节点有重复的 (pid === this.currentNode.id)
      // 1. 获取所有部门的数据
      const { depts } = await getDepartments()

      // 2. 找出当前点击部门的子部门数据有什么特点？ pid = 当前点击部门的id
      // 编辑场景 >>需要把自己过滤掉之后再去做判断
      let currentChildren = null
      if (this.formData.id) {
        // 编辑
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        })
      } else {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.id
        })
      }

      // 3. value值是否和筛选出来的数据结果里面的name值有重复
      const isRepeat = currentChildren.some(item => item.name === value)

      if (isRepeat) {
        return Promise.reject('部门名称重复')
      }
    }
    const checkCode = async(rule, value) => {
      const { depts } = await getDepartments()
      let isRepeat = null
      if (this.formData.id) {
        isRepeat = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }

      if (isRepeat) {
        return Promise.reject('部门编码重复了')
      }
    }
    return {
      options: [],
      // 数据对象
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 规则对象
      rules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空'
          },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符'
          },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空'
          },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符'
          },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空'
          },
          {
            min: 1,
            max: 300,
            message: '部门介绍要求1-300个字符'
          }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  watch: {},
  methods: {
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple()
    },
    async getDepartmentsById(id) {
      // id >> 需要获取详情的部门id
      this.formData = await getDepartDetail(id)
    },
    async submit() {
      // 表单校验
      await this.$refs.form.validate()
      if (this.formData.id) {
        // 编辑
        await updateDepartments(this.formData)
      } else {
        await addDepartments(
          {
            ...this.formData, // 把表单的数据对象展开
            pid: this.currentNode.id
          }
        )
      }
      this.$message.success(`${this.showTitle}成功`)
      // 重新拉取列表数据 >> 通知父组件执行的
      this.$emit('getDepartments')
      this.close()
    },
    close() {
      this.$refs.form.resetFields()
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:is-show-add-dept', false)
    }
  }
}
</script>

<style scoped lang="scss">
.el-form {
  padding-left: 20px;
  .el-input{
    //width: 500px;
    width: 80%;
  }
}

</style>
