import store from '@/store'
export const mixins = {
  created() {},
  methods: {
    checkPermission(key) {
      // console.log(store.state.user.userinfo.roles.points)
      return !store.state.user.userinfo.roles.points.includes(key)
    }
  }
}
