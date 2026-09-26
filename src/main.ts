import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { directive } from './utils/directive'
import { router } from './router'
import { i18n } from './i18n'
import 'virtual:svg-icons-register'

import '@/icons/iconfont/iconfont'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'

import MaComponent from '@/components/index'

const app = createApp(App)
app.use(createPinia())

// element plusIcon global registration
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

// Register custom directives
directive(app)
app.use(i18n)
app.use(router)
app.use(MaComponent)
app.use(ElementPlus)
app.mount('#app')
