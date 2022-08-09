<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>共50条记录</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('/import')">导入</el-button>
          <el-button size="mini" type="danger" @click="exportToExcel">导出</el-button>
          <el-button size="mini" type="warning" @click="isShowDialog=true">新增员工</el-button>
        </template>
      </ToolBar>

      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" sortable="" prop="username">
            <template v-slot="{row}">
              <el-row type="flex" justify="center">
                <el-avatar style="width: 80px;height: 80px;" :src="row.staffPhoto" @click.native="showQrCode(row.staffPhoto)">
                  <img src="@/assets/common/bigUserHeader.png" alt="">
                </el-avatar>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column :formatter="formatter" label="聘用形式" sortable="" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button :disabled="checkPermission('DELETE_USER')" type="text" size="small" @click="delBtn(row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="page.size"
            :current-page="page.page"
            @current-change="changeCurrent"
          />
        </el-row>
      </el-card>
    </div>
    <AddDemplovee :is-show-dialog.sync="isShowDialog" />
    <el-dialog :visible.sync="showAvatar" title="二维码预览">
      <el-row type="flex" justify="center">
        <canvas ref="canvas" />
      </el-row>
    </el-dialog>
    <AssignRole ref="roleRefs" :current-id="currentId" :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees'
import { delEmployee } from '@/api/employees'
import AddDemplovee from '@/views/employees/components'
import { formatDate } from '@/filters'
import qrCode from 'qrcode'
import AssignRole from './components/assign-role'
import { mixins } from '@/utils/mixins'
const headers = {
  '手机号': 'mobile',
  '姓名': 'username',
  '入职日期': 'timeOfEntry',
  '聘用形式': 'formOfEmployment',
  '转正日期': 'correctionTime',
  '工号': 'workNumber',
  '部门': 'departmentName'
}
export default {
  components: { AddDemplovee, AssignRole },
  mixins: [mixins],
  data() {
    return {
      currentId: '',
      showDialog: false, // 角色
      showAvatar: false, // 二维码预览
      isShowDialog: false,
      list: [],
      page: {
        page: 1,
        size: 10
      },
      total: 0
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async editRole(id) {
      this.currentId = id
      await this.$refs.roleRefs.getUserDetailById(id)
      this.showDialog = true
    },
    showQrCode(url) {
      // console.log(url)
      this.showAvatar = true
      // console.log(this.$refs.canvas)
      this.$nextTick(() => {
        qrCode.toCanvas(this.$refs.canvas, url)
      })
    },
    async exportToExcel() {
      // 预期导出一个excel
      // 动态导入一个模块的时候，使用import语法
      // import返回值是一个promise
      // 如果想要拿到模块内部导出的内容， then(res) 接收

      // 使用魔法注释 >> 自定义文件名
      // webpackChunkName: '文件名'
      const { export_json_to_excel } = await import(
        /* webpackChunkName: 'export2Excel' */
        '@/utils/Export2'
      )
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      const resData = this.formatterData(rows, headers)

      export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        data: resData, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    formatterData(rows, headers) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return EmployeesEnum.hireType.find(child => +child.id === +item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.total = total
    },
    // 切换分页时
    changeCurrent(page) {
      this.page.page = page
      this.getEmployeeList()
    },
    // 用来格式化内容
    formatter(row, column, cellValue) {
      // eslint-disable-next-line no-return-assign
      const currentData = EmployeesEnum.hireType.find(item => item.id = cellValue)?.value
      return currentData || '未知'
    },
    async delBtn(data) {
      try {
        await this.$confirm(`确认删除 < ${data.username} >？`)
        await delEmployee(data.id)
        await this.$message.success(`删除 < ${data.username} >成功！`)
        await this.getEmployeeList()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>
