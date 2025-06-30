<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit" class="form-login">
      <h2>Login do Organizador</h2>
      <p class="subtitulo">Aceda para gerir os seus torneios.</p>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div v-if="!isNewPasswordRequired" class="form-grupo">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div v-if="!isNewPasswordRequired" class="form-grupo">
        <label for="senha">Senha</label>
        <input type="password" id="senha" v-model="senha" required />
      </div>
      <div v-if="isNewPasswordRequired" class="form-grupo">
        <label for="new-password">Nova Senha</label>
        <input type="password" id="new-password" v-model="newPassword" required />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Aguarde...' : (isNewPasswordRequired ? 'Definir Senha e Entrar' : 'Entrar') }}
      </button>

      <div class="link-cadastro">
        Não tem uma conta? <router-link to="/cadastro">Crie uma agora</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'
import { signIn, confirmSignIn, fetchUserAttributes } from 'aws-amplify/auth'

const email = ref('')
const senha = ref('')
const newPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const isNewPasswordRequired = ref(false)
const router = useRouter()
const auth = useAuth()

async function fetchAttributesAndLogin(role: 'jogador' | 'organizador') {
    const attributes = await fetchUserAttributes();
    auth.login(role, {
        username: attributes.email || '',
        name: attributes.name
    });
    router.push(`/${role}/dashboard`);
}

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
      await fetchAttributesAndLogin('organizador');
    } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
      isNewPasswordRequired.value = true
    } else {
      errorMessage.value = `Passo de login inesperado: ${nextStep.signInStep}`
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = error.message || 'Ocorreu um erro.';
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.';
    }
  } finally {
    isLoading.value = false
  }
}

async function handleNewPasswordSubmit() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await confirmSignIn({ challengeResponse: newPassword.value })
    await fetchAttributesAndLogin('organizador');
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = `Erro ao definir nova senha: ${error.message}`
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido ao definir a nova senha.'
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
  background-color: var(--cor-texto-principal);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled {
    background-color: #ccc;
}
.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
}
.link-cadastro {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
}
</style>
