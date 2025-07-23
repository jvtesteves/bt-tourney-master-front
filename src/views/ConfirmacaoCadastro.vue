<template>
  <div class="confirmacao-container">
    <form @submit.prevent="handleConfirmacao" class="form-confirmacao">
      <h2>Confirme a sua Conta</h2>
      <p class="subtitulo">Enviámos um código de verificação para o seu email: <strong>{{ email }}</strong></p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-grupo">
        <label for="code">Código de Confirmação</label>
        <input type="text" id="code" v-model="confirmationCode" required />
      </div>

      <button type="submit" class="btn-confirmar" :disabled="isLoading">
        {{ isLoading ? 'A Confirmar...' : 'Confirmar e Entrar' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { confirmSignUp } from 'aws-amplify/auth';

const route = useRoute();
const router = useRouter();

const email = ref('');
const confirmationCode = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// Pega o email do parâmetro da URL assim que a página é carregada
onMounted(() => {
  email.value = (route.query.email as string) || '';
  if (!email.value) {
    errorMessage.value = 'Email não fornecido. Por favor, volte à página de cadastro.';
  }
});

async function handleConfirmacao() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // Chama a função de confirmação do Cognito
    await confirmSignUp({
      username: email.value,
      confirmationCode: confirmationCode.value,
    });

    alert('Conta confirmada com sucesso! Por favor, faça o login.');
    router.push('/login/jogador');

  } catch (error: unknown) {
    console.error("Erro ao confirmar o cadastro:", error);
    if (error instanceof Error) {
      errorMessage.value = error.message || 'Ocorreu um erro durante a confirmação.';
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.'
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.confirmacao-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
.form-confirmacao {
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
.btn-confirmar {
  width: 100%;
  padding: 0.8rem;
  background-color: #2a9d8f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
.btn-confirmar:disabled {
    background-color: #ccc;
}
.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .form-login, .form-cadastro, .form-confirmacao, .form-redefinir {
    box-shadow: none;
    padding: 1rem;
  }
}
</style>
