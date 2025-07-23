<template>
  <div class="inscricoes-container">
    <div class="navegacao-voltar">
      <router-link to="/jogador/dashboard" class="voltar-link">
        &larr; Voltar para Meu Painel
      </router-link>
    </div>

    <h2 class="titulo">Minhas Inscrições</h2>
    <p class="subtitulo">Acompanhe o estado de todas as suas inscrições em torneios ativos.</p>

    <div v-if="isLoading" class="feedback-container">
      <p>A carregar as suas inscrições...</p>
    </div>

    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="myInscriptions.length > 0" class="lista-inscricoes">
      <div v-for="inscricao in myInscriptions" :key="inscricao.id" class="inscricao-card">
        <div class="info-principal">
          <h3>{{ inscricao.tournamentName }}</h3>
          <p class="categoria">{{ inscricao.category }}</p>
        </div>
        <div class="info-dupla">
          <p>
            <strong>{{ inscricao.category.toLowerCase().includes('duo') ? 'Dupla:' : 'Jogador:' }}</strong>
            {{ inscricao.category.toLowerCase().includes('duo') ? inscricao.team.join(' e ') : inscricao.team[0] }}
          </p>
        </div>
        <div class="info-estado">
          <span :class="['status-badge', `status-${inscricao.status.toLowerCase()}`]">
            {{ inscricao.status }}
          </span>
        </div>
        <div class="card-actions">
          <router-link :to="`/torneio/${inscricao.tournamentId}/chaves`" class="btn-acao">
            Ver Chaves
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="feedback-container">
      <p>Você ainda não se inscreveu em nenhum torneio ou não possui inscrições recentes.</p>
      <router-link to="/torneios" class="btn-link">Ver Torneios Abertos</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { callApi } from '../services/api'

// Interface para os dados da inscrição que vêm da API
interface Inscription {
  id: string;
  tournamentId: string;
  tournamentName: string;
  team: string[];
  category: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
  createdAt: string;
}

// Variáveis reativas para o estado do componente
const myInscriptions = ref<Inscription[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// onMounted é executado assim que o componente é carregado
onMounted(async () => {
  try {
    const data = await callApi('/my-inscriptions')
    data.sort((a: Inscription, b: Inscription) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    myInscriptions.value = data
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar as suas inscrições. ${error.message}`
    } else {
      errorMessage.value = `Ocorreu um erro desconhecido ao carregar as suas inscrições.`
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.inscricoes-container {
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
.lista-inscricoes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.inscricao-card {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr auto;
  align-items: center;
  gap: 1.5rem;
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
.info-dupla p {
  margin: 0;
}
.info-estado {
  text-align: right;
}
.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
}
.status-pendente {
  background-color: #fef08a;
  color: #a16207;
}
.status-aprovada {
  background-color: #dcfce7;
  color: #166534;
}
.status-rejeitada {
  background-color: #fee2e2;
  color: #991b1b;
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
