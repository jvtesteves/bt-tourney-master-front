<template>
  <div class="redefinir-senha-container">
    <form @submit.prevent="handleSubmit" class="form-redefinir">
      <h2>Redefinir Senha</h2>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
        <router-link to="/login/jogador" class="link-login-agora">Faça login agora</router-link>
      </div>

      <div v-if="!successMessage">
        <p v-if="step === 'request'" class="subtitulo">
          Por favor, insira o seu email para receber um código de verificação.
        </p>
        <p v-else class="subtitulo">
          Verifique o seu email e insira o código recebido e a sua nova senha.
        </p>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Etapa 1: Pedir o Email -->
        <div v-if="step === 'request'" class="form-grupo">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>

        <!-- Etapa 2: Pedir o Código e a Nova Senha -->
        <div v-if="step === 'confirm'">
          <div class="form-grupo">
            <label for="code">Código de Verificação</label>
            <input type="text" id="code" v-model="confirmationCode" required />
          </div>
          <div class="form-grupo">
            <label for="new-password">Nova Senha</label>
            <input type="password" id="new-password" v-model="newPassword" required />
          </div>
           <div class="form-grupo">
            <label for="confirm-password">Confirmar Nova Senha</label>
            <input type="password" id="confirm-password" v-model="confirmNewPassword" required />
          </div>
        </div>

        <button type="submit" class="btn-redefinir" :disabled="isLoading">
          {{ isLoading ? 'Aguarde...' : (step === 'request' ? 'Enviar Código' : 'Redefinir Senha') }}
        </button>
      </div>

      <div v-if="!successMessage" class="link-voltar">
        <router-link to="/login/jogador">&larr; Voltar para o Login</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// CORREÇÃO: useRoute não é mais necessário, então foi removido.
import { resetPassword, confirmResetPassword, signOut } from 'aws-amplify/auth';

const email = ref('');
const confirmationCode = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const step = ref<'request' | 'confirm'>('request');

onMounted(async () => {
  try {
    await signOut();
  // CORREÇÃO: Como a variável 'error' não era usada, podemos omiti-la do catch.
  } catch {
    console.log("Nenhum utilizador logado para deslogar, a continuar para a redefinição de senha.");
  }
});

async function handleRequestCode() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await resetPassword({ username: email.value });
    step.value = 'confirm';
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = error.message || 'Ocorreu um erro.';
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.';
    }
  } finally {
    isLoading.value = false;
  }
}

async function handleConfirmReset() {
  if (newPassword.value !== confirmNewPassword.value) {
    errorMessage.value = 'As senhas não coincidem.';
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await confirmResetPassword({
      username: email.value,
      confirmationCode: confirmationCode.value,
      newPassword: newPassword.value,
    });
    successMessage.value = 'A sua senha foi redefinida com sucesso!';
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = error.message || 'Ocorreu um erro.';
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.';
    }
  } finally {
    isLoading.value = false;
  }
}

function handleSubmit() {
  if (step.value === 'request') {
    handleRequestCode();
  } else {
    handleConfirmReset();
  }
}
</script>

<style scoped>
.redefinir-senha-container { display: flex; justify-content: center; align-items: center; padding: 2rem; }
.form-redefinir { width: 100%; max-width: 450px; padding: 2rem; background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
h2, .subtitulo { text-align: center; }
.subtitulo { color: #555; margin-bottom: 1.5rem; }
.form-grupo { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; }
input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.btn-redefinir { width: 100%; padding: 0.8rem; background-color: var(--cor-texto-principal); color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
.btn-redefinir:disabled { background-color: #ccc; }
.error-message { color: #e74c3c; text-align: center; margin-bottom: 1rem; }
.success-message { color: #155724; background-color: #d4edda; text-align: center; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
.link-login-agora { font-weight: bold; display: block; margin-top: 0.5rem; }
.link-voltar { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; display: block; }
</style>
