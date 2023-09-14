import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css'; // a normal css style
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // elementplus icon

import "@/styles/index.scss"; // global css
import "@/icons"; // icon

import SvgIcon from '@/components/SvgIcon' // svg组件

const app = createApp(App)
// register element icon component
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('SvgIcon', SvgIcon)
app.use(store).use(router).mount('#app')
