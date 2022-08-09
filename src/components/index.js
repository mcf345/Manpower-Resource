import ToolBar from '@/components/ToolBar'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'

export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUpload.name, ImageUpload)
  }
}

