<template>
  <div class="dashboard-container">
    <h2 class="titulo">Meu Painel</h2>
    <p v-if="auth.dadosDoUtilizador.value?.name" class="subtitulo">
      Bem-vindo de volta, {{ auth.dadosDoUtilizador.value.name }}!
    </p>

    <div class="cards-container">
      <!-- Card para Minhas Inscrições -->
      <router-link to="/jogador/inscricoes" class="dashboard-card">
        <h3>Minhas Inscrições</h3>
        <p>Veja o estado das suas inscrições e os seus próximos jogos.</p>
      </router-link>

      <!-- Card para Meu Histórico -->
      <router-link to="/jogador/historico" class="dashboard-card">
        <h3>Meu Histórico</h3>
        <p>Consulte o seu desempenho em torneios anteriores.</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/store/auth'

const auth = useAuth()
</script>

<style scoped>
.dashboard-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
}
.titulo {
  font-size: 2.5rem;
  font-weight: bold;
}
.subtitulo {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 3rem;
}
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
.dashboard-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}
.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
.dashboard-card h3 {
  margin-top: 0;
  font-size: 1.5rem;
  color: var(--cor-texto-principal);
}
.dashboard-card p {
  line-height: 1.6;
}
</style>
