import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import '@/style/bootstrap.css'

createApp(App).use(store).use(store).mount('#app')
