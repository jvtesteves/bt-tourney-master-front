<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit" class="form-login">
      <!-- O título muda dependendo do passo em que estamos -->
      <h2>{{ isNewPasswordRequired ? 'Definir Nova Senha' : 'Área do Jogador' }}</h2>
      <p class="subtitulo">
        {{ isNewPasswordRequired ? 'Você precisa de definir uma nova senha para continuar.' : 'Aceda para ver os seus torneios e resultados.' }}
      </p>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <!-- Campos de E-mail e Senha, desativados se for para definir nova senha -->
      <div v-if="!isNewPasswordRequired" class="form-grupo">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div v-if="!isNewPasswordRequired" class="form-grupo">
        <label for="senha">Senha</label>
        <input type="password" id="senha" v-model="senha" required />
      </div>

      <!-- Campo para a nova senha, só aparece quando necessário -->
      <div v-if="isNewPasswordRequired" class="form-grupo">
        <label for="new-password">Nova Senha</label>
        <input type="password" id="new-password" v-model="newPassword" required />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Aguarde...' : (isNewPasswordRequired ? 'Definir Senha e Entrar' : 'Entrar') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'
import { signIn, confirmSignIn } from 'aws-amplify/auth'

const email = ref('')
const senha = ref('')
const newPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const isNewPasswordRequired = ref(false)

const router = useRouter()
const auth = useAuth()

// Função principal que decide qual lógica executar
async function handleSubmit() {
  if (isNewPasswordRequired.value) {
    await handleNewPasswordSubmit()
  } else {
    await fazerLogin()
  }
}

async function fazerLogin() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: email.value,
      password: senha.value
    })

    if (isSignedIn) {
      auth.login('jogador', { username: email.value })
      router.push('/jogador/dashboard')
    } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
      // Se uma nova senha for necessária, atualizamos o estado da UI
      isNewPasswordRequired.value = true
    } else {
      // Lida com outros possíveis passos, como MFA
      errorMessage.value = `Passo de login inesperado: ${nextStep.signInStep}`
    }

  } catch (error: unknown) {
    console.error('Erro ao fazer login:', error)
    if (error instanceof Error) {
      if (error.name === 'UserNotFoundException') {
        errorMessage.value = 'Usuário não encontrado.';
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage.value = 'Email ou senha incorretos.';
      } else {
        errorMessage.value = 'Ocorreu um erro. Tente novamente.';
      }
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.'
    }
  } finally {
    isLoading.value = false
  }
}

// Nova função para lidar com o envio da nova senha
async function handleNewPasswordSubmit() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    // Usamos a função confirmSignIn para completar o fluxo
    await confirmSignIn({ challengeResponse: newPassword.value })

    // Se bem-sucedido, agora o login está completo
    auth.login('jogador', { username: email.value })
    router.push('/jogador/dashboard')

  } catch (error: unknown) {
    console.error('Erro ao definir nova senha:', error)
    if (error instanceof Error) {
        errorMessage.value = `Erro ao definir nova senha: ${error.message}`
    } else {
        errorMessage.value = 'Ocorreu um erro desconhecido.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
.form-login {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
}
.subtitulo {
  text-align: center;
  color: #555;
  margin-bottom: 1.5rem;
}
.form-grupo {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 0.8rem;
  background-color: #2a9d8f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
