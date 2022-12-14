const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userId,
  name: state => state.user.username,
  staffPhoto: state => state.user.staffPhoto,
  companyId: state => state.user.userinfo.companyId,
  routes: state => state.permission.routes,
  companyName: state => state.user.userinfo?.companyName
}
export default getters
