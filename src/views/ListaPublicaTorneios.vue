<template>
  <div class="lista-publica-container">
    <h2 class="titulo">Torneios Abertos</h2>
    <p class="subtitulo">Encontre o próximo desafio e faça sua inscrição!</p>

    <div v-if="torneios.length === 0" class="sem-torneios">
      <p>Nenhum torneio disponível no momento. Volte em breve!</p>
    </div>

    <div v-else class="lista-torneios">
      <div
        v-for="torneio in torneios"
        :key="torneio.id"
        class="torneio-card"
        @click="verDetalhes(torneio.id)"
      >
        <h3>{{ torneio.nome }}</h3>
        <p><strong>Local:</strong> {{ torneio.local }}</p>
        <p>
          <strong>Data:</strong> {{ formatarData(torneio.dataInicio) }} a
          {{ formatarData(torneio.dataFim) }}
        </p>
        <span class="ver-mais">Ver mais detalhes</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { torneios } from '../store' // Usa a mesma store dos organizadores

const router = useRouter()

function verDetalhes(id) {
  router.push(`/torneio/${id}`)
}

// Função para formatar a data para um padrão mais legível
function formatarData(data) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>

<style scoped>
.lista-publica-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.titulo {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.subtitulo {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.2rem;
  opacity: 0.8;
}
.sem-torneios {
  text-align: center;
  padding: 3rem;
  background-color: #fff;
  border-radius: 8px;
}
.lista-torneios {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.torneio-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.torneio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.torneio-card h3 {
  margin-top: 0;
  color: var(--cor-texto-principal);
}
.ver-mais {
  display: inline-block;
  margin-top: 1rem;
  font-weight: bold;
  color: var(--cor-texto-principal);
  text-decoration: underline;
}
</style>
