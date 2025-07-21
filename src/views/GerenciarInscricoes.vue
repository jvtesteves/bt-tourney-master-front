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
        <div class="header-actions">
          <button
            @click="generateDraw"
            :disabled="isGeneratingDraw || chavesForamGeradas || approvedInscriptionsCount < 2"
            class="btn-acao-header"
            :title="getGenerateButtonTitle()"
          >
            {{ isGeneratingDraw ? 'A Gerar...' : (chavesForamGeradas ? 'Chaves Geradas' : 'Gerar Chaves') }}
          </button>
          <router-link
            v-if="chavesForamGeradas"
            :to="`/organizador/gerenciar-torneios/${tournamentId}/resultados`"
            class="btn-acao-header btn-secundario"
          >
            Gerir Resultados
          </router-link>
        </div>
      </div>

      <div v-if="sortedInscriptions.length > 0" class="lista-inscricoes">
        <div v-for="inscricao in sortedInscriptions" :key="inscricao.id" class="inscricao-card">
          <div class="info-inscricao">
            <p>
              <strong>{{ inscricao.category.toLowerCase().includes('duo') ? 'Dupla:' : 'Jogador:' }}</strong>
              {{ inscricao.category.toLowerCase().includes('duo') ? inscricao.team.join(' e ') : inscricao.team[0] }}
            </p>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { callApi, callPublicApi } from '../services/api'

// Interfaces
interface Tournament { id: string; name: string; }
interface Inscription {
  id: string;
  team: string[];
  category: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
  createdAt: string;
}

const route = useRoute()
const router = useRouter()
const tournamentId = route.params.id as string

// Estado
const torneio = ref<Tournament | null>(null)
const inscriptions = ref<Inscription[]>([])
const chavesForamGeradas = ref(false)
const isLoading = ref(true)
const isGeneratingDraw = ref(false)
const errorMessage = ref('')

const sortedInscriptions = computed(() => {
  return [...inscriptions.value].sort((a, b) => {
    if (a.status === 'Pendente' && b.status !== 'Pendente') return -1;
    if (b.status === 'Pendente' && a.status !== 'Pendente') return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
});

const approvedInscriptionsCount = computed(() => {
  return inscriptions.value.filter(i => i.status === 'Aprovada').length;
});

function getGenerateButtonTitle(): string {
  if (chavesForamGeradas.value) return 'As chaves para este torneio já foram geradas.';
  if (approvedInscriptionsCount.value < 2) return 'São necessárias pelo menos 2 inscrições aprovadas.';
  return 'Gerar as chaves do torneio';
}

// CORREÇÃO: Renomeado para não conflitar com o hook onMounted
async function fetchData() {
  isLoading.value = true;
  try {
    const [tournamentData, inscriptionsData, drawData] = await Promise.all([
      callPublicApi(`/public/tournaments/${tournamentId}`),
      callApi(`/tournaments/${tournamentId}/inscriptions`),
      callPublicApi(`/public/tournaments/${tournamentId}/draw`).catch(() => null)
    ]);
    torneio.value = tournamentData;
    inscriptions.value = inscriptionsData;
    chavesForamGeradas.value = !!drawData;
  } catch (error) {
    if (error instanceof Error) errorMessage.value = `Não foi possível carregar os dados: ${error.message}`;
    else errorMessage.value = 'Ocorreu um erro desconhecido.';
  } finally {
    isLoading.value = false;
  }
}

// Chama a função fetchData quando o componente é montado
onMounted(fetchData);

async function generateDraw() {
  isGeneratingDraw.value = true;
  errorMessage.value = '';
  try {
    await callApi(`/tournaments/${tournamentId}/draw`, { method: 'POST' });
    alert('Chaves geradas com sucesso!');
    // CORREÇÃO: Navega para a página de resultados em vez de chamar um hook
    router.push(`/organizador/gerenciar-torneios/${tournamentId}/resultados`);
  } catch (error) {
    if (error instanceof Error) alert(`Erro ao gerar as chaves: ${error.message}`);
    else alert('Ocorreu um erro desconhecido.');
  } finally {
    isGeneratingDraw.value = false;
  }
}

async function updateStatus(inscriptionId: string, newStatus: 'Aprovada' | 'Rejeitada') {
  try {
    const updatedInscription = await callApi(`/inscriptions/${inscriptionId}`, {
      method: 'PATCH',
      body: { status: newStatus },
    });
    const index = inscriptions.value.findIndex(i => i.id === inscriptionId);
    if (index !== -1) {
      inscriptions.value[index] = updatedInscription;
    }
  } catch (error) {
    if (error instanceof Error) alert(`Erro ao atualizar a inscrição: ${error.message}`);
    else alert('Ocorreu um erro desconhecido.');
  }
}
</script>

<style scoped>
/* Os seus estilos permanecem os mesmos */
.gerenciar-inscricoes-container { max-width: 900px; margin: 2rem auto; padding: 2rem; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.titulo { margin: 0; font-size: 2rem; }
.voltar-link { text-decoration: none; font-weight: bold; color: var(--cor-texto-principal); margin-bottom: 1.5rem; display: inline-block; }
.header-actions { display: flex; gap: 1rem; }
.btn-acao-header {
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  /* ATUALIZAÇÃO: Adiciona um tamanho de letra fixo e alinhamento */
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-acao-header.btn-secundario { background-color: var(--cor-texto-principal); opacity: 0.9; }
.btn-acao-header.btn-secundario:hover { opacity: 1; }
.btn-acao-header:disabled { background-color: #a9a9a9; color: white; cursor: not-allowed; opacity: 0.7; }
.lista-inscricoes { display: flex; flex-direction: column; gap: 1rem; }
.inscricao-card { background-color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); display: flex; justify-content: space-between; align-items: center; }
.info-inscricao p { margin: 0; font-size: 1.1rem; }
.info-inscricao .categoria { font-style: italic; color: #555; }
.status-e-acoes { display: flex; align-items: center; gap: 1rem; }
.status-badge { padding: 0.3rem 0.8rem; border-radius: 12px; font-weight: bold; font-size: 0.9rem; }
.status-pendente { background-color: #fef08a; color: #a16207; }
.status-aprovada { background-color: #dcfce7; color: #166534; }
.status-rejeitada { background-color: #fee2e2; color: #991b1b; }
.botoes-acao { display: flex; gap: 0.5rem; }
.btn-aprovar, .btn-rejeitar { padding: 0.5rem 1rem; border: none; border-radius: 5px; font-weight: 500; cursor: pointer; transition: opacity 0.2s; }
.btn-aprovar { background-color: #22c55e; color: white; }
.btn-rejeitar { background-color: #ef4444; color: white; }
.btn-aprovar:hover, .btn-rejeitar:hover { opacity: 0.8; }
.feedback-container { background-color: white; padding: 2rem; text-align: center; border-radius: 8px; }
.feedback-container.error { background-color: #f8d7da; color: #721c24; }
</style>
