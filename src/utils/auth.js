import Cookies from 'js-cookie'

const TokenKey = 'hrsass_token'
const timekey = 'time_key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timekey)
}
// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(timekey, Date.now())
}
