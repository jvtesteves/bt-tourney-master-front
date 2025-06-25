<template>
  <div class="dashboard-organizador">
    <h2 class="titulo">Seu Dashboard</h2>
    <p class="subtitulo">Gerencie seus torneios de forma fácil e rápida.</p>

    <div class="acoes-grid">
      <!-- Card para Criar Torneio -->
      <div @click="navegarPara('/criar-torneio')" class="acao-card">
        <h3>Criar Novo Torneio</h3>
        <p>Configure um novo evento, defina categorias e datas.</p>
      </div>

      <!-- Card para Gerenciar Torneios -->
      <div @click="navegarPara('/gerenciar-torneios')" class="acao-card">
        <h3>Gerenciar Torneios</h3>
        <p>Visualize e edite seus torneios existentes.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' // 1. Importe o useRouter

const router = useRouter() // 2. Obtenha a instância do roteador

function navegarPara(caminho) {
  router.push(caminho) // 3. Crie a função de navegação
}
</script>

<style scoped>
.dashboard-organizador {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.titulo {
  font-size: 2.2rem;
  color: var(--cor-texto-principal);
  margin-bottom: 0.5rem;
}

.subtitulo {
  font-size: 1.1rem;
  color: var(--cor-texto-principal);
  opacity: 0.8;
  margin-bottom: 2.5rem;
}

.acoes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.acao-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.acao-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.acao-card h3 {
  margin-top: 0;
  color: var(--cor-texto-principal);
}
</style>
