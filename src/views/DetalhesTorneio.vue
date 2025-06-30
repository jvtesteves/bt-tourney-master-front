<template>
  <div class="detalhes-container">
    <div class="navegacao-voltar">
      <router-link to="/torneios" class="voltar-link">
        &larr; Voltar para a Lista de Torneios
      </router-link>
    </div>

    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="feedback-container">
      <p>A carregar detalhes do torneio...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
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
          v-if="auth.tipoDeUtilizador.value !== 'organizador'"
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
import { useAuth } from '../store/auth'

interface Tournament {
  id: string;
  name: string;
  location: string;
  dates: string;
}

const route = useRoute()
const auth = useAuth() // Inicializa o store de autenticação
const tournamentId = route.params.id as string

const torneio = ref<Tournament | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  if (!tournamentId) {
    errorMessage.value = "ID do torneio não encontrado no URL."
    isLoading.value = false
    return
  }

  try {
    const data = await callPublicApi(`/public/tournaments/${tournamentId}`)
    torneio.value = data
  } catch (error: unknown) {
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
}
.navegacao-voltar {
  margin-bottom: 1.5rem;
}
.voltar-link {
  text-decoration: none;
  font-weight: bold;
  color: var(--cor-texto-principal);
  display: inline-block;
}
.feedback-container {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.feedback-container.error {
    color: #721c24;
    background-color: #f8d7da;
}
.conteudo-torneio {
    text-align: center;
    background-color: white;
    padding: 2rem;
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
  text-decoration: none;
  display: inline-block;
}
</style>
