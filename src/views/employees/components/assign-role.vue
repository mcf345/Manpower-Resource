<template>
  <el-dialog title="分配角色" :visible="showDialog" @close="close">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <template #footer>
      <el-button type="primary" size="small" @click="btnOk">确定</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async btnOk() {
      try {
        await assignRoles({
          id: this.currentId,
          roleIds: this.roleIds
        })
        this.$message.success('修改角色成功')
        this.close()
      } catch (e) {
        this.$message.error('修改失败')
        this.close()
      }
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
      // console.log(this.roleIds)
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    close() {
      this.roleIds = []
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

