<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <TreeToo :is-root="true" :tree-node="company" @handleAddDept="handleAddDept" />
      </el-card>

      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{data}">
          <TreeToo
            :is-root="false"
            :tree-node="data"
            @handleEditDept="handleEditDept"
            @handleAddDept="handleAddDept"
            @getDepartments="getDepartments"
          />
        </template>
      </el-tree>

      <addDept
        ref="addDept"
        :current-node="currentNode"
        :is-show-add-dept.sync="isShowAddDept"
        @getDepartments="getDepartments"
      />

    </div>
  </div>
</template>

<script>
import TreeToo from '@/views/departments/components/tree-too'
import addDept from './components/add-dept'
import { getDepartments } from '@/api/departments'
import { transListToTreeNew } from '@/utils'
export default {
  components: { TreeToo, addDept },
  data() {
    return {
      loading: false,
      isShowAddDept: false,
      currentNode: {},
      departs: [{ name: '总裁办', id: '', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name', // 表示 从这个属性显示内容
        children: 'children'
      },
      company: { name: '传智教育', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    handleAddDept(node) {
      this.isShowAddDept = true
      this.currentNode = node
      // console.log('被点击了添加')
    },
    handleEditDept(node) {
      this.isShowAddDept = true
      this.currentNode = node
      this.$refs.addDept.getDepartmentsById(node.id)
      // console.log('被点击了编辑')
    },
    async getDepartments() {
      this.loading = true
      try {
        const res = await getDepartments()
        // console.log(res)
        this.company = {
          id: '',
          name: res.companyName,
          manager: res.companyManage || '管理员'
        }
        // this.departs = transListToTree(res.depts, '')
        this.departs = transListToTreeNew(res.depts)
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    }
  }
}

</script>

<style scoped lang="scss">
.dashboard-container {
  .app-container {
    margin: 50px auto;
    border: 2px solid red;
    width: 850px;
  }
}

</style>
