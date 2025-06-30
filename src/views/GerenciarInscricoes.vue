<template>
  <div class="gerenciar-inscricoes-container">
    <router-link to="/organizador/gerenciar-torneios" class="voltar-link">
      &larr; Voltar para Meus Torneios
    </router-link>

    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="feedback-container">
      <p>A carregar inscrições...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Conteúdo principal -->
    <div v-else-if="torneio">
      <div class="header">
        <h2 class="titulo">Inscrições para: {{ torneio.name }}</h2>
        <button
          @click="generateDraw"
          :disabled="isGeneratingDraw || inscriptions.length < 2"
          class="btn-gerar-chaves"
        >
          {{ isGeneratingDraw ? 'A Gerar...' : 'Gerar Chaves' }}
        </button>
      </div>

      <div v-if="inscriptions.length > 0" class="lista-inscricoes">
        <div v-for="inscricao in inscriptions" :key="inscricao.id" class="inscricao-card">
          <div class="info-inscricao">
            <p><strong>Dupla:</strong> {{ inscricao.team.join(' e ') }}</p>
            <p class="categoria"><strong>Categoria:</strong> {{ inscricao.category }}</p>
          </div>
          <div class="status-e-acoes">
            <span :class="['status-badge', `status-${inscricao.status.toLowerCase()}`]">
              {{ inscricao.status }}
            </span>
            <div v-if="inscricao.status === 'Pendente'" class="botoes-acao">
              <button @click="updateStatus(inscricao.id, 'Aprovada')" class="btn-aprovar">Aprovar</button>
              <button @click="updateStatus(inscricao.id, 'Rejeitada')" class="btn-rejeitar">Rejeitar</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="feedback-container">
        <p>Ainda não há nenhuma inscrição para este torneio.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { callApi, callPublicApi } from '../services/api'

// Interfaces
interface Tournament {
  id: string;
  name: string;
}
interface Inscription {
  id: string;
  team: string[];
  category: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
}

const route = useRoute()
const router = useRouter()
const tournamentId = route.params.id as string

// Estado da página
const torneio = ref<Tournament | null>(null)
const inscriptions = ref<Inscription[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const isGeneratingDraw = ref(false)

// Busca os dados iniciais
onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const tournamentData = await callPublicApi(`/public/tournaments/${tournamentId}`)
    torneio.value = tournamentData

    const inscriptionsData = await callApi(`/tournaments/${tournamentId}/inscriptions`)
    inscriptions.value = inscriptionsData
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar os dados. ${error.message}`
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.'
    }
  } finally {
    isLoading.value = false
  }
})

// Atualiza o estado de uma inscrição
async function updateStatus(inscriptionId: string, newStatus: 'Aprovada' | 'Rejeitada') {
  try {
    const updatedInscription = await callApi(`/inscriptions/${inscriptionId}`, {
      method: 'PATCH',
      body: { status: newStatus },
    })
    const index = inscriptions.value.findIndex(i => i.id === inscriptionId)
    if (index !== -1) {
      inscriptions.value[index] = updatedInscription
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Erro ao atualizar a inscrição: ${error.message}`)
    } else {
      alert('Ocorreu um erro desconhecido.')
    }
  }
}

// Gera as chaves do torneio
async function generateDraw() {
  isGeneratingDraw.value = true
  errorMessage.value = ''

  try {
    // Chama o endpoint para gerar as chaves
    await callApi(`/tournaments/${tournamentId}/draw`, {
      method: 'POST',
    });

    alert('Chaves geradas com sucesso!');
    // Redireciona o organizador para a página de visualização de chaves
    router.push(`/torneio/${tournamentId}/chaves`);

  } catch (error: unknown) {
    console.error("Erro ao gerar as chaves:", error);
    if (error instanceof Error) {
      alert(`Erro ao gerar as chaves: ${error.message}`);
      errorMessage.value = `Erro ao gerar as chaves: ${error.message}`;
    } else {
      alert('Ocorreu um erro desconhecido.');
      errorMessage.value = 'Ocorreu um erro desconhecido.';
    }
  } finally {
    isGeneratingDraw.value = false
  }
}
</script>

<style scoped>
.gerenciar-inscricoes-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.titulo {
  margin: 0;
  font-size: 2rem;
}
.voltar-link {
  text-decoration: none;
  font-weight: bold;
  color: var(--cor-texto-principal);
  margin-bottom: 1.5rem;
  display: inline-block;
}
.lista-inscricoes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.inscricao-card {
  background-color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-inscricao p {
  margin: 0;
  font-size: 1.1rem;
}
.info-inscricao .categoria {
    font-size: 1rem;
    font-style: italic;
    color: #555;
}
.status-e-acoes {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9rem;
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
.botoes-acao {
  display: flex;
  gap: 0.5rem;
}
.btn-aprovar, .btn-rejeitar {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-aprovar {
  background-color: #22c55e;
  color: white;
}
.btn-rejeitar {
  background-color: #ef4444;
  color: white;
}
.btn-aprovar:hover, .btn-rejeitar:hover {
  opacity: 0.8;
}
.feedback-container {
  background-color: white;
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
}
.feedback-container.error {
    background-color: #f8d7da;
    color: #721c24;
}
.btn-gerar-chaves {
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.btn-gerar-chaves:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
