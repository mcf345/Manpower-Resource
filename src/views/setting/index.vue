<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <el-button icon="el-icon-plus" size="small" type="primary" @click="showDailog=true">新增角色</el-button>

            <el-table
              :data="list"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                width="180"
              />
              <el-table-column
                prop="name"
                label="角色"
                width="180"
              />
              <el-table-column
                prop="description"
                label="描述"
              />
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--       分页       -->
            <el-row type="flex" justify="center" style="margin-top: 20px;">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changeCurrent"
              />
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="消息提示的文案"
              type="info"
              show-icon
            />
            <el-form disabled label-width="80px" style="margin-top: 40px;">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" style="width: 50%;" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" style="width: 50%;" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" style="width: 50%;" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" style="width: 50%;" type="textarea" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-dialog :title="`${roleFormDate.id ? '编辑' : '新增'}`" :visible="showDailog" @close="close">
        <el-form ref="rolForm" label-width="120px" :model="roleFormDate" :rules="rolRules">
          <el-form-item label="角色" prop="name">
            <el-input v-model="roleFormDate.name" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="roleFormDate.description" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="ready">确认</el-button>
        </template>
      </el-dialog>

      <el-dialog :visible="showAssignPerm" title="分配权限" @close="closePermission">
        <el-tree
          ref="treeRef"
          default-expand-all
          :props="props"
          show-checkbox
          check-strictly
          node-key="id"
          :data="permissionList"
          :default-checked-keys="selectCheck"
        />
        <template #footer>
          <el-button @click="closePermission">取消</el-button>
          <el-button type="primary" @click="btnOk">确认</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addRole, assignPerm, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { transListToTree } from '@/utils'
import { assignRoles } from '@/api/employees'

export default {
  data() {
    return {
      props: {
        label: 'name'
      },
      selectCheck: [],
      permissionList: [],
      showAssignPerm: false, // 分配权限
      currentRoleId: null, // 当前点击的id
      showDailog: false,
      activeName: 'first',
      list: [],
      total: 0,
      page: {
        page: 1,
        pagesize: 2
      },
      formData: {},
      roleFormDate: {
        name: '',
        description: ''
      },
      rolRules: {
        name: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 分配权限
    async assignPerm(id) {
      this.currentRoleId = id
      // console.log(id)  // 当前点击的角色id
      // 从后端获取的扁平的数组结构转化成树形结构
      // 所有的权限数据转化成树形 >> 默认展示
      this.permissionList = transListToTree(await getPermissionList(), '0') // 获取权限
      // 处理当前角色拥有的权限信息，默认选中
      const { permIds } = await getRoleDetail(id) // 获取角色详情
      this.selectCheck = permIds
      this.showAssignPerm = true
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.total = total
    },
    changeCurrent(page) {
      // 切换之后最新页码
      this.page.page = page
      this.getRoleList()
    },
    // 获取公司详细信息
    async getCompanyInfo() {
      // 使用公司id
      this.formData = await getCompanyInfo()
    },
    async del(id) {
      await this.$confirm('确认删除该角色？')
      // 获取当前界面删除数据之前的数据长度
      const len = this.list.length
      await deleteRole(id)
      // 如果删除之前的数据长度为1，同时当前页码数不是第一页的情况下 页码自减1
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }
      // 重新获取数据
      // 成功的提示
      this.$message.success('删除成功')
      // 重新拉取列表数据
      await this.changeCurrent()
    },
    async edit(id) {
      this.showDailog = true
      this.roleFormDate = await getRoleDetail(id)
    },
    close() {
      this.showDailog = false
      this.roleFormDate = { name: '', description: '' }
    },
    async ready() {
      await this.$refs.rolForm.validate()
      if (this.roleFormDate.id) {
        await updateRole(this.roleFormDate)
      } else {
        await addRole(this.roleFormDate)
      }
      this.$message.success(`${this.roleFormDate.id ? '编辑' : '新增'}成功`)
      await this.getRoleList()
      this.close()
    },
    async btnOk() {
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      console.log(checkedKeys)
      await assignPerm({
        id: this.currentRoleId,
        permIds: checkedKeys
      })
      this.$message.success('分配权限成功')
      this.closePermission()
    },
    closePermission() {
      this.showAssignPerm = false
      this.selectCheck = []
    }
  }
}
</script>

<style>

</style>
