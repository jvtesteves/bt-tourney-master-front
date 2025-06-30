import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify'
import App from './App.vue'
import router from './router'

// 1. Configuração da Amplify com a estrutura correta para a v6+
Amplify.configure({
  Auth: {
    Cognito: {
      // ID do User Pool
      userPoolId: 'sa-east-1_z5OvqHadk',

      // ID do Cliente de Aplicação
      userPoolClientId: '5qbfq0jtnbc0t0h04e0ou7nqs4',
    }
  },
});

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
