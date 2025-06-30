<template>
  <div class="cadastro-container">
    <form @submit.prevent="handleCadastro" class="form-cadastro">
      <h2>Criar Nova Conta</h2>
      <p class="subtitulo">Junte-se à comunidade de Beach Tennis!</p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-grupo">
        <label for="name">Seu Nome Completo</label>
        <input type="text" id="name" v-model="name" required />
      </div>

      <div class="form-grupo">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-grupo">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="password" required />
        <p class="password-hint">Mínimo de 8 caracteres, com números, símbolos, maiúsculas e minúsculas.</p>
      </div>
       <div class="form-grupo">
        <label for="confirm-password">Confirmar Senha</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" required />
      </div>

      <button type="submit" class="btn-cadastrar" :disabled="isLoading">
        {{ isLoading ? 'A Criar...' : 'Criar Conta' }}
      </button>

      <div class="link-login">
        Já tem uma conta? <router-link to="/login/jogador">Faça login</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signUp } from 'aws-amplify/auth';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

async function handleCadastro() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await signUp({
      username: email.value,
      password: password.value,
      options: {
        userAttributes: {
          email: email.value,
          name: name.value,
        },
      }
    });

    router.push({ name: 'ConfirmacaoCadastro', query: { email: email.value } });

  } catch (error: unknown) {
    console.error("Erro ao fazer o cadastro:", error);
    if (error instanceof Error) {
      errorMessage.value = error.message || 'Ocorreu um erro durante o cadastro.';
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.cadastro-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
.form-cadastro {
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
h2, .subtitulo {
  text-align: center;
}
.subtitulo {
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
.password-hint {
    font-size: 0.8rem;
    color: #777;
    margin-top: 0.3rem;
}
.btn-cadastrar {
  width: 100%;
  padding: 0.8rem;
  background-color: #2a9d8f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
.btn-cadastrar:disabled {
    background-color: #ccc;
}
.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
}
.link-login {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
}
</style>
