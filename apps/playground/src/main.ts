import { createApp } from 'vue'
import { GlacePlugin } from '@glace-ui/vue'
import '@glace-ui/core/css'
import App from './App.vue'

const app = createApp(App)
app.use(GlacePlugin)
app.mount('#app')
