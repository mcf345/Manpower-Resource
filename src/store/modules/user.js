// 状态
import { getToken, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { getUserDetailById, getUserInfo, login } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userinfo: {},
  username: '',
  userId: '',
  staffPhoto: ''
}
// 修改状态
const mutations = {
  // 修改用户信息
  setUserInfo(state, userinfo) {
    state.userinfo = userinfo
    state.username = userinfo.username
    state.userId = userinfo.userId
    state.staffPhoto = userinfo.staffPhoto
  },
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  removeUserInfo(state) {
    state.userinfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    console.log(data)
    // 拿到 token
    const res = await login(data)
    setTimeStamp()// 获取时间戳
    console.log(res)
    context.commit('setToken', res)
  },
  async UserInfo(context) {
    // 拿到用户数据
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // console.log({ ...res, ...baseInfo })
    context.commit('setUserInfo', { ...res, ...baseInfo })
    return { ...baseInfo, ...res }
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 重置路由匹配信息
    resetRouter()
    // context是根节点的上下文
    // vuex里面的路由表置空
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

