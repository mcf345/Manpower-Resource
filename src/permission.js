// 处理权限判断
import store from '@/store' // 拿到 store 仓库
import router from '@/router' // 拿到路由
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const loginPath = '/login'
const NotFoundPath = '/404'
const wihteList = [loginPath, NotFoundPath] // 设置通行的白名单地址

// 路由发生跳转 会触发 路由守卫
// 前置守卫  to>>目标路由 from>>当前路由  next >>带你用形式据欸的那个最终去哪个路由
router.beforeEach(async(to, from, next) => {
  // 判断是否有token
  if (store.getters.token) {
    NProgress.start() // 开启进度条
    // 有token 没有用户信息 请求接口 获取用户信息
    if (!store.getters.userId) {
      const res = await store.dispatch('user/UserInfo')
      // 添加用户拥有的路由权限之后，再去做跳转 filterRoutes
      // console.log(res.roles.menus)
      const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)
      // console.log(routes)
      // 默认情况只有静态路由
      // 进行动态路由的添加
      router.addRoutes([...routes, // 404 page must be placed at the end !!!
        { path: '*', redirect: '/404', hidden: true }])
      // 重新再进行跳转
      next(to.path)
    }

    // 判断是否在 登录页面
    // eslint-disable-next-line no-lone-blocks
    {
      if (to.path === loginPath) {
      // 去首页
        next('/')
      } else {
        next()
      }
    }
  } else {
    // 判断白名单地址是否包含你在的地方
    if (wihteList.includes(to.path)) {
      next()
    } else {
      next(loginPath)
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
