<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <ToolBar>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addBtn('0',1)"
          >
            添加权限
          </el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column fixed type="index" label="序号" width="70" align="center" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type === 1" type="text" @click="addBtn(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog :title=" `${title}权限` " :visible="showDailog" @close="close">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <!-- 当值为1(active-value)时，激活节点，当值为(inactive-value)0时，不激活
          v-model绑定的为当前switch对应的值 -->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="close">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permisson'
import { transListToTree } from '@/utils'

export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDailog: false,
      formData: {
        name: '',
        code: '',
        description: '',
        enVisible: '',
        type: '',
        pid: ''
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    // 初始化的时候获取所有的权限列表数据
    this.getPermissionList()
  },
  methods: {
    addBtn(pid, type) {
      this.showDailog = true
      this.formData.pid = pid
      // console.log(pid, type)
      this.formData.type = type
    },
    async btnOK() {
      await this.$refs.perForm.validate()
      try {
        if (this.formData.id) {
          //  编辑
          await updatePermission(this.formData)
          this.$message.success('修改成功')
        } else {
          await addPermission(this.formData)
          this.$message.success('新增成功')
        }
        this.close()
        await this.getPermissionList()
      } catch (e) {
        console.log(e)
        this.$message.error('修改失败')
      }
    },
    close() {
      this.showDailog = false
      this.formData = {
        name: '',
        code: '',
        description: '',
        enVisible: '',
        type: '',
        pid: ''
      }
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDailog = true
    },
    async delPermission(id) {
      await this.$confirm('确认删除？')
      await delPermission(id)
      this.$message.success('删除成功')
      await this.getPermissionList()
    },
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = transListToTree(res, '0')
      // console.log(this.list)
    }
  }
}
</script>

<style>

</style>
