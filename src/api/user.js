import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
/**
 *  获取用户的基本资料
 *
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function getInfo(token) {

}

export function logout() {

}
