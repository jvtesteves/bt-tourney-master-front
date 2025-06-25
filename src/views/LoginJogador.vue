<template>
  <div class="login-container">
    <form @submit.prevent="fazerLogin" class="form-login">
      <h2>Área do Jogador</h2>
      <p class="subtitulo">Aceda para ver os seus torneios e resultados.</p>
      <div class="form-grupo">
        <label for="email">Email</label>
        <input type="email" id="email" required />
      </div>
      <div class="form-grupo">
        <label for="senha">Senha</label>
        <input type="password" id="senha" required />
      </div>
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'

const router = useRouter()
const { login } = useAuth()

function fazerLogin() {
  // Num sistema real, aqui iria a validação das credenciais.
  // Para o nosso exemplo, simplesmente definimos o tipo de utilizador.
  login('jogador')
  router.push('/jogador/dashboard')
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
}
</style>
