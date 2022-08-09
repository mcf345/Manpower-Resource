import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

const TimeOut = 3000000 // 定义超时时间 单位s
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return currentTime - timeStamp > TimeOut
}

const request = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
})

// 请求拦截器 config 配置项
request.interceptors.request.use(config => {
  const token = store.getters.token
  // 判断是否有token 有的话 直接在请求拦截器里 配置项的请求头里 添加token
  if (token) {
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject('token超时了')
    }
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(response => {
  const { data: { data, success, message }} = response
  if (success) {
    return data
  }
  Message.error(message || '系统错误')
  return Promise.reject(message || '系统错误')
}, error => {
  if (error.response.status === 401) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  Message.error(error.response?.status?.data?.message || '系统错误')
  return Promise.reject(error)
})

export default request // 默认导出 request 请求
