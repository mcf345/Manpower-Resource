<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px">
        <el-option v-for="item in yearList" :key="item" :label="`${item}年`" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px">
        <el-option v-for="item in 12" :key="item" :label="`${item}月`" :value="item" />
      </el-select>
    </el-row>
    <el-calendar v-model="value">
      <template #dateCell="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  filters: {
    getDay(value) {
      // console.log(day)
      return value.split('-')[2]
    }
  },
  props: {
    currentDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      yearList: [] // 存储的是年份下拉列表
      // value: new Date()
    }
  },
  computed: {
    value: {
      get() {
        return new Date(this.currentYear, this.currentMonth - 1)
      },
      set(value) {
        this.currentYear = value.getFullYear()
        this.currentMonth = value.getMonth() + 1
      }
    }
  },
  created() {
    this.currentMonth = this.currentDate.getMonth() + 1
    this.currentYear = this.currentDate.getFullYear()
    this.yearList = Array.from(Array(11), (item, index) => {
      return this.currentYear + index - 5
    })
  },
  methods: {
    isWeek(date) {
      // console.log(date)
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style  scoped lang="scss">
::v-deep .el-calendar__header {
  display: none
}
.date-content {
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  .rest {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    background-color: red;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    font-weight: 700;
  }
}
</style>

