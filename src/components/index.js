import ToolBar from '@/components/ToolBar'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import ScreenFull from '@/components/ScreenFull'
import ThemePicker from '@/components/ThemePicker'
import Lang from '@/views/Lang'
import TagsView from './TagsView'

export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUpload.name, ImageUpload)
    Vue.component(ScreenFull.name, ScreenFull)
    Vue.component(ThemePicker.name, ThemePicker)
    Vue.component(Lang.name, Lang)
    Vue.component(TagsView.name, TagsView)
  }
}

