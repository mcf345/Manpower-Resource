// 自定义指令
// 解决图片失效问题
export const imgError = {
// 1、bind (绑定事件触发)
// 2、inserted (节点插入的时候触发)
// 3、update (组件内相关更新)
  inserted(el, options) {
    // console.log(options.value)
    // 如果当图片的复制出错 给他一个默认图片
    el.onerror = function() {
      el.src = options.value
    }
  }
}
export const focus = {
  inserted(el, options) {
    el.focus()
  }
}
