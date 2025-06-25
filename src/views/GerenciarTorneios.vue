<template>
  <div class="gerenciar-container">
    <div class="header">
      <h2 class="titulo">Seus Torneios</h2>
      <router-link to="/organizador/criar-torneio" class="btn-novo-torneio"
        >Criar Novo Torneio</router-link
      >
    </div>

    <div v-if="torneios.length === 0" class="sem-torneios">
      <p>Você ainda não criou nenhum torneio.</p>
    </div>

    <div v-else class="lista-torneios">
      <div v-for="torneio in torneios" :key="torneio.id" class="torneio-card">
        <div class="card-content">
          <h3>{{ torneio.nome }}</h3>
          <p><strong>Local:</strong> {{ torneio.local }}</p>
          <p><strong>Data:</strong> {{ torneio.dataInicio }} a {{ torneio.dataFim }}</p>
          <p class="contador-inscricoes">{{ contarInscricoes(torneio.id) }} inscrições</p>
        </div>
        <div class="card-actions">
          <button @click="verInscricoes(torneio.id)" class="btn-ver-inscricoes">
            Ver Inscrições
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { torneios } from '../store'
import { inscricoes } from '../store/inscricoes'
import type { Inscricao } from '../store/types' // <-- CORREÇÃO: Importa de 'types.ts'

const router = useRouter()

function verInscricoes(torneioId: number) {
  router.push(`/organizador/gerenciar-torneios/${torneioId}/inscricoes`)
}

// Função para contar quantas inscrições um torneio possui
function contarInscricoes(torneioId: number): number {
  // Usamos uma asserção de tipo para garantir que o TypeScript entenda a estrutura
  return (inscricoes.value as Inscricao[]).filter((i: Inscricao) => i.torneioId === torneioId)
    .length
}
</script>

<style scoped>
.gerenciar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}
.titulo {
  font-size: 2.2rem;
  margin: 0;
}
.btn-novo-torneio {
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}
.sem-torneios {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
}
.lista-torneios {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.torneio-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-content {
  padding: 1.5rem;
}
.torneio-card h3 {
  margin-top: 0;
}
.contador-inscricoes {
  font-weight: bold;
  color: var(--cor-texto-principal);
  margin-top: 1rem;
}
.card-actions {
  padding: 1rem 1.5rem;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
  text-align: right;
}
.btn-ver-inscricoes {
  background: none;
  border: 1px solid var(--cor-texto-principal);
  color: var(--cor-texto-principal);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-ver-inscricoes:hover {
  background-color: var(--cor-destaque);
}
</style>
