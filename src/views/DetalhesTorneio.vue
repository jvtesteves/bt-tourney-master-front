<template>
  <div class="detalhes-container">
    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="feedback-container">
      <p>A carregar detalhes do torneio...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
      <router-link to="/torneios" class="btn-link">Ver todos os torneios</router-link>
    </div>

    <!-- Conteúdo do Torneio -->
    <div v-else-if="torneio" class="conteudo-torneio">
      <h2 class="titulo-torneio">{{ torneio.name }}</h2>
      <p class="local-torneio">{{ torneio.location }}</p>
      <p class="data-torneio">
        <strong>Datas:</strong> {{ torneio.dates }}
      </p>

      <div class="acoes-principais">
        <router-link
          :to="`/torneio/${torneio.id}/inscrever`"
          class="btn-inscrever"
        >
          Inscrever-se agora
        </router-link>
        <router-link
          :to="`/torneio/${torneio.id}/chaves`"
          class="btn-ver-chaves"
        >
          Ver Chaves
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { callPublicApi } from '../services/api'

// Define a interface para os dados do torneio que vêm da API
interface Tournament {
  id: string;
  name: string;
  location: string;
  dates: string;
}

const route = useRoute()
const tournamentId = route.params.id as string
const torneio = ref<Tournament | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

// onMounted é executado assim que o componente é carregado
onMounted(async () => {
  if (!tournamentId) {
    errorMessage.value = "ID do torneio não encontrado no URL."
    isLoading.value = false
    return
  }

  try {
    // Chama o endpoint dinâmico
    const data = await callPublicApi(`/public/tournaments/${tournamentId}`)
    torneio.value = data
  } catch (error: unknown) {
    console.error("Erro ao obter detalhes do torneio:", error);
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar os detalhes do torneio: ${error.message}`
    } else {
      errorMessage.value = "Ocorreu um erro desconhecido."
    }
  } finally {
    isLoading.value = false
  }
})
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
.feedback-container {
  text-align: center;
  padding: 2rem;
}
.feedback-container.error {
    color: #721c24;
}
.conteudo-torneio {
    text-align: center;
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
  display: flex;
  gap: 1.5rem;
  justify-content: center;
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
