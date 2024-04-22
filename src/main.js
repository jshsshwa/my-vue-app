import { createApp } from 'vue'
import './style.css'
import 'nprogress/nprogress.css'
//引入element-plus
import ElementPlus from 'element-plus'
//引入css样式
import 'element-plus/dist/index.css'
//引入路由自定义模块
import router from './router/index.js'
//element图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入Vuex
import store from '@/store' 
import App from './App.vue'
const app = createApp(App)
app.use(store)
//注册element图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
//将element-plus注册成全局可用组件库
app.use(ElementPlus)
app.mount('#app')
