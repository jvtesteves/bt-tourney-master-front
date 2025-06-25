import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importe o roteador

const app = createApp(App)

app.use(router) // Use o roteador na aplicação
app.mount('#app')