<template>
  <el-row style="width: 100%;" type="flex" justify="space-between">
    <el-col :span="24">
      <span>{{ TreeNode.name }}</span>
    </el-col>
    <el-col :span="6">
      <el-row type="flex" justify="space-between">
        <el-col>
          <span>{{ TreeNode.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown style="margin-left: 10px;" @command="clickItem">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
  name: 'TreeToo',
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    TreeNode: {
      type: Object,
      default: () => ({})
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async clickItem(type) {
      // console.log(type)
      // 判断点击的按钮
      if (type === 'add') {
        // 添加
        this.$emit('handleAddDept', this.TreeNode)
        // console.log('add')
      } else if (type === 'edit') {
        this.$emit('handleEditDept', this.TreeNode)
        // console.log('edit')
      } else {
        await this.$confirm('确认退出?')
        // console.log('删除成功')
        await delDepartments(this.TreeNode.id)
        //  删除成功
        this.$message.success('删除成功')
        this.$emit('getDepartments')
      }
    }
  }
}
</script>
