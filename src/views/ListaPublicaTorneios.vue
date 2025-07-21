<template>
  <div class="lista-publica-container">
    <h2 class="titulo">Torneios Abertos</h2>
    <p class="subtitulo">Encontre o próximo desafio e faça sua inscrição!</p>

    <div v-if="isLoading" class="sem-torneios">
      <p>A procurar torneios...</p>
    </div>
    <div v-else-if="errorMessage" class="sem-torneios error">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="tournaments.length === 0" class="sem-torneios">
      <p>Nenhum torneio disponível no momento. Volte em breve!</p>
    </div>
    <div v-else class="lista-torneios">
      <div
        v-for="torneio in tournaments"
        :key="torneio.id"
        class="torneio-card"
        @click="verDetalhes(torneio.id)"
      >
        <h3>{{ torneio.name }}</h3>
        <p><strong>Local:</strong> {{ torneio.location }}</p>
        <p><strong>Data:</strong> {{ torneio.dates }}</p>
        <span class="ver-mais">Ver mais detalhes</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { callPublicApi } from '../services/api'

interface Tournament {
  id: string;
  name: string;
  location: string;
  dates: string;
  createdAt: string; // Precisamos do createdAt para ordenar
}

const router = useRouter()
const tournaments = ref<Tournament[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

function verDetalhes(id: string) {
  router.push(`/torneio/${id}`)
}

onMounted(async () => {
  try {
    const data = await callPublicApi('/public/tournaments')
    // ATUALIZAÇÃO: Ordena os torneios após recebê-los
    data.sort((a: Tournament, b: Tournament) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    tournaments.value = data
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar os torneios: ${error.message}`
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Os seus estilos permanecem os mesmos */
.lista-publica-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.titulo { text-align: center; font-size: 2.5rem; margin-bottom: 0.5rem; }
.subtitulo { text-align: center; margin-bottom: 3rem; font-size: 1.2rem; opacity: 0.8; }
.sem-torneios { text-align: center; padding: 3rem; background-color: #fff; border-radius: 8px; }
.sem-torneios.error { background-color: #f8d7da; color: #721c24; }
.lista-torneios { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
.torneio-card { background-color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.torneio-card:hover { transform: translateY(-5px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); }
.torneio-card h3 { margin-top: 0; color: var(--cor-texto-principal); }
.ver-mais { display: inline-block; margin-top: 1rem; font-weight: bold; color: var(--cor-texto-principal); text-decoration: underline; }
</style>
