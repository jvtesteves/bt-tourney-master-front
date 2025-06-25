<template>
  <div class="detalhes-container">
    <div v-if="torneio">
      <h2 class="titulo-torneio">{{ torneio.nome }}</h2>
      <p class="local-torneio">{{ torneio.local }}</p>
      <p class="data-torneio">
        De {{ formatarData(torneio.dataInicio) }} a {{ formatarData(torneio.dataFim) }}
      </p>

      <div class="acoes-principais">
        <router-link
          v-if="!chavesForamGeradas"
          :to="`/torneio/${torneioId}/inscrever`"
          class="btn-inscrever"
        >
          Inscrever-se agora
        </router-link>
        <router-link
          v-if="chavesForamGeradas"
          :to="`/torneio/${torneioId}/chaves`"
          class="btn-ver-chaves"
        >
          Ver Chaves
        </router-link>
      </div>
    </div>
    <div v-else class="torneio-nao-encontrado">
      <h2>Torneio não encontrado</h2>
      <p>O torneio que você está procurando não existe ou foi removido.</p>
      <router-link to="/torneios" class="btn-link">Ver todos os torneios</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { torneios } from '../store'
import { chaves } from '../store/chaves' // Importa a store de chaves

const route = useRoute()
const torneioId = Number(route.params.id)

const torneio = computed(() => torneios.value.find((t) => t.id === torneioId))
// Verifica se existem chaves para este torneio
const chavesForamGeradas = computed(() => !!chaves.value[torneioId])

function formatarData(data) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>

<style scoped>
.detalhes-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.titulo-torneio {
  font-size: 2.8rem;
  margin: 0;
}
.local-torneio {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-top: 0.5rem;
}
.data-torneio {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2.5rem;
}
.acoes-principais {
  text-align: center;
}
.btn-inscrever,
.btn-ver-chaves {
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
}
.btn-inscrever:hover,
.btn-ver-chaves:hover {
  background-color: #333;
}
.torneio-nao-encontrado {
  text-align: center;
  padding: 2rem;
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
