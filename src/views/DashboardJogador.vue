<template>
  <div class="dashboard-container">
    <h2 class="titulo">Meu Painel</h2>
    <p v-if="auth.dadosDoUtilizador.value?.name" class="subtitulo">
      Bem-vindo, {{ auth.dadosDoUtilizador.value.name }}!
    </p>
    <!-- Fallback para o email se o nome não estiver disponível -->
    <p v-else-if="auth.dadosDoUtilizador.value?.username" class="subtitulo">
      Bem-vindo, {{ auth.dadosDoUtilizador.value.username }}!
    </p>

    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="feedback-container">
      <p>A carregar os seus torneios...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Lista de torneios inscritos -->
    <div v-else-if="myInscriptions.length > 0" class="seccao-torneios">
      <h3>Meus Torneios Inscritos</h3>
      <div v-for="inscricao in myInscriptions" :key="inscricao.id" class="torneio-card">
        <h4>{{ inscricao.tournamentName }}</h4>
        <p><strong>Minha Dupla:</strong> {{ inscricao.team.join(' e ') }}</p>
        <p><strong>Categoria:</strong> {{ inscricao.category }}</p>
        <p><strong>Estado da Inscrição:</strong>
          <span :class="['status-badge', `status-${inscricao.status.toLowerCase()}`]">{{ inscricao.status }}</span>
        </p>
         <div class="card-actions">
          <router-link :to="`/torneio/${inscricao.tournamentId}/chaves`" class="btn-acao">
            Ver Chaves
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mensagem para quando não há inscrições -->
    <div v-else class="feedback-container">
      <p>Você ainda não se inscreveu em nenhum torneio.</p>
      <router-link to="/torneios" class="btn-link">Ver Torneios Abertos</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/store/auth'
import { callApi } from '@/services/api'

// Interface para os dados da inscrição que vêm da API
interface Inscription {
  id: string;
  tournamentId: string;
  tournamentName: string;
  team: string[];
  category: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
}

const auth = useAuth()

// Variáveis reativas para o estado do componente
const myInscriptions = ref<Inscription[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// onMounted é executado assim que o componente é carregado
onMounted(async () => {
  try {
    // Chama o nosso novo endpoint protegido
    const data = await callApi('/my-inscriptions')
    myInscriptions.value = data
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar os seus torneios. ${error.message}`
    } else {
      errorMessage.value = `Ocorreu um erro desconhecido ao carregar os seus torneios.`
    }
  } finally {
    isLoading.value = false
  }
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
.torneio-card h4 {
    margin-top: 0;
    font-size: 1.3rem;
}
.torneio-card p {
    margin: 0.5rem 0;
}
.card-actions {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f0f0f0;
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
.status-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.8rem;
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
</style>
