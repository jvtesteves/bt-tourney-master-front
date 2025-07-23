<template>
  <div class="historico-container">
    <div class="navegacao-voltar">
      <router-link to="/jogador/dashboard" class="voltar-link">
        &larr; Voltar para Meu Painel
      </router-link>
    </div>

    <h2 class="titulo">Meu Histórico</h2>
    <p class="subtitulo">Reveja o seu desempenho nos torneios concluídos.</p>

    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="feedback-container">
      <p>A carregar o seu histórico...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Lista de torneios do histórico -->
    <div v-else-if="history.length > 0" class="lista-historico">
      <div v-for="item in history" :key="item.id" class="historico-card">
        <div class="info-principal">
          <h3>{{ item.tournamentName }}</h3>
          <p class="categoria">{{ item.category }}</p>
        </div>
        <div class="info-desempenho">
          <!-- Exibe um destaque especial para Campeão ou Finalista -->
          <span :class="['desempenho-badge', getStatusClass(item.finalStatus)]">
            {{ item.finalStatus }}
          </span>
        </div>
        <div class="card-actions">
          <router-link :to="`/torneio/${item.tournamentId}/chaves`" class="btn-acao">
            Ver Chaveamento
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mensagem para quando não há histórico -->
    <div v-else class="feedback-container">
      <p>Você ainda não tem torneios concluídos no seu histórico.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { callApi } from '../services/api'

// Interface para os dados do histórico que vêm da API
interface HistoryEntry {
  id: string;
  tournamentId: string;
  tournamentName: string;
  category: string;
  finalStatus: 'Campeão' | 'Finalista' | 'Participou';
  team: string[];
  status: string;
  playerMatches: object[];
}

// Variáveis reativas para o estado do componente
const history = ref<HistoryEntry[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// Função para retornar uma classe CSS com base no estado
function getStatusClass(status: string): string {
  switch (status) {
    case 'Campeão':
      return 'status-campeao';
    case 'Finalista':
      return 'status-finalista';
    default:
      return 'status-participou';
  }
}

// onMounted é executado assim que o componente é carregado
onMounted(async () => {
  try {
    const data = await callApi('/my-history')
    history.value = data
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar o seu histórico. ${error.message}`
    } else {
      errorMessage.value = `Ocorreu um erro desconhecido ao carregar o seu histórico.`
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.historico-container {
  max-width: 1000px;
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
.titulo {
  font-size: 2.2rem;
}
.subtitulo {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2.5rem;
}
.feedback-container {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.feedback-container.error {
    background-color: #f8d7da;
    color: #721c24;
}
.lista-historico {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.historico-card {
  display: grid;
  grid-template-columns: 3fr 1fr auto;
  align-items: center;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.info-principal h3 {
  margin: 0;
  font-size: 1.3rem;
}
.info-principal .categoria {
  font-size: 1rem;
  color: #555;
  font-style: italic;
}
.info-desempenho {
  text-align: center;
}
.desempenho-badge {
  padding: 0.4rem 1rem;
  border-radius: 16px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
}
.status-campeao {
  background-color: #fef08a; /* Amarelo Dourado */
  color: #a16207;
}
.status-finalista {
  background-color: #e0e7ff; /* Azul Claro */
  color: #3730a3;
}
.status-participou {
  background-color: #f3f4f6; /* Cinzento Claro */
  color: #4b5563;
}
.card-actions {
    text-align: right;
}
.btn-acao {
  background: none;
  border: 1px solid var(--cor-texto-principal);
  color: var(--cor-texto-principal);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
}

@media (max-width: 768px) {
  .inscricao-card, .historico-card {
    grid-template-columns: 1fr;
    gap: 1rem;
    justify-items: start;
  }

  .info-estado, .info-desempenho, .card-actions {
    width: 100%;
    text-align: left;
  }
}
</style>
