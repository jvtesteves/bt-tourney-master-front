<template>
  <div class="dashboard-container">
    <h2 class="titulo">Meu Painel</h2>
    <p class="subtitulo">Bem-vindo, Jogador!</p>

    <div v-if="meusTorneios.length" class="seccao-torneios">
      <h3>Meus Torneios Inscritos</h3>
      <div v-for="torneio in meusTorneios" :key="torneio.id" class="torneio-card">
        <h4>{{ torneio.nomeTorneio }}</h4>
        <p><strong>Minha Dupla:</strong> {{ torneio.dupla.join(' e ') }}</p>
      </div>
    </div>
    <div v-else class="sem-torneios">
      <p>Você ainda não se inscreveu em nenhum torneio.</p>
      <router-link to="/torneios" class="btn-link">Ver Torneios Abertos</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { inscricoes } from '../store/inscricoes'
import type { Inscricao } from '../store/types' // <-- CORREÇÃO: Importa de 'types.ts'

// Para este exemplo, consideramos que o jogador logado é "Jogador 1"
// Num sistema real, este nome viria da store de autenticação.
const nomeJogadorLogado = 'Jogador 1'

const meusTorneios = computed(() => {
  // Usamos uma asserção de tipo para garantir que o TypeScript entenda a estrutura
  return (inscricoes.value as Inscricao[]).filter((inscricao: Inscricao) =>
    inscricao.dupla.includes(nomeJogadorLogado),
  )
})
</script>

<style scoped>
.dashboard-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
}
.titulo {
  font-size: 2.2rem;
}
.subtitulo {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2.5rem;
}
.seccao-torneios h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.torneio-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.sem-torneios {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
}
.btn-link {
  display: inline-block;
  margin-top: 1rem;
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}
</style>
