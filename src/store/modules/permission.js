import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: constantRoutes
}

const mutations = {
  // newRoutes动态路由
  // 请求到个人信息的时候，动态路由和静态路由进行合并
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  filterRoutes(context, menus) {
    // console.log(menus)
    const resRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.name)
    })
    // console.log(resRoutes)
    context.commit('setRoutes', resRoutes)
    return resRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
