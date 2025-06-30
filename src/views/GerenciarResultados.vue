<template>
  <div class="gerenciar-resultados-container">
    <router-link :to="`/organizador/gerenciar-torneios`" class="voltar-link">
      &larr; Voltar para Meus Torneios
    </router-link>

    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="feedback-container">
      <p>A carregar jogos...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Conteúdo principal -->
    <div v-else-if="torneio && draw">
      <div class="header">
        <h2 class="titulo">Gerir Resultados: {{ torneio.name }}</h2>
        <!-- NOVO: Botão para avançar a ronda -->
        <button
          @click="advanceRound"
          :disabled="!canAdvanceRound || isAdvancing"
          class="btn-avancar-ronda"
        >
          {{ isAdvancing ? 'A Processar...' : 'Avançar Ronda' }}
        </button>
      </div>

      <div class="rodadas-container">
        <!-- Itera sobre cada ronda para exibir os jogos -->
        <div v-for="roundNumber in rounds" :key="roundNumber" class="rodada">
          <h4>Ronda {{ roundNumber }}</h4>
          <div class="lista-jogos">
            <div v-for="(match, index) in getMatchesForRound(roundNumber)" :key="match.id" class="jogo-card">
              <div class="dupla">
                <span>{{ match.team1.team.join(' & ') }}</span>
                <input
                  type="number"
                  v-model="results[getGlobalIndex(match.id)].team1"
                  placeholder="Pts"
                  class="input-resultado"
                  :disabled="match.winner !== null"
                />
              </div>
              <div class="vs">vs</div>
              <div class="dupla">
                <input
                  type="number"
                  v-model="results[getGlobalIndex(match.id)].team2"
                  placeholder="Pts"
                  class="input-resultado"
                  :disabled="match.winner !== null || match.team2.id === 'BYE'"
                />
                <span v-if="match.team2.id !== 'BYE'" class="nome-dupla">{{ match.team2.team.join(' & ') }}</span>
                <span v-else class="bye">BYE</span>
              </div>
              <div class="acao-salvar">
                <button
                  @click="submitResult(match, getGlobalIndex(match.id))"
                  class="btn-salvar"
                  :disabled="match.winner !== null || isSubmitting[match.id] || match.team2.id === 'BYE'"
                >
                  {{ isSubmitting[match.id] ? 'A Salvar...' : (match.winner ? 'Salvo' : 'Salvar') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { callApi, callPublicApi } from '../services/api';

// Interfaces
interface Team { id: string; team: string[] }
interface Match {
  id: string;
  round: number;
  team1: Team;
  team2: Team;
  winner: 'team1' | 'team2' | null;
  result: { team1: number | null, team2: number | null } | null;
}
interface Draw { tournamentId: string; matches: Match[] }
interface Tournament { name: string }
type LocalResult = { team1: number | string, team2: number | string };

const route = useRoute();
const tournamentId = route.params.id as string;

// Estado da página
const torneio = ref<Tournament | null>(null);
const draw = ref<Draw | null>(null);
const results = ref<LocalResult[]>([]);
const isSubmitting = ref<Record<string, boolean>>({});
const isLoading = ref(true);
const errorMessage = ref('');
const isAdvancing = ref(false);

// Propriedades Computadas
const rounds = computed(() => {
  if (!draw.value) return [];
  const roundNumbers = draw.value.matches.map(m => m.round);
  return [...new Set(roundNumbers)].sort((a, b) => a - b);
});

const canAdvanceRound = computed(() => {
  if (!draw.value || rounds.value.length === 0) return false;
  const lastRoundNumber = rounds.value[rounds.value.length - 1];
  const lastRoundMatches = draw.value.matches.filter(m => m.round === lastRoundNumber);
  // Verifica se todos os jogos da última ronda estão finalizados
  return lastRoundMatches.every(m => m.winner !== null || m.team2.id === "BYE");
});

// Funções
function getMatchesForRound(roundNumber: number): Match[] {
  return draw.value?.matches.filter(m => m.round === roundNumber) || [];
}

function getGlobalIndex(matchId: string): number {
  return draw.value?.matches.findIndex(m => m.id === matchId) ?? -1;
}

async function fetchData() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const [tournamentData, drawData] = await Promise.all([
      callPublicApi(`/public/tournaments/${tournamentId}`),
      callPublicApi(`/public/tournaments/${tournamentId}/draw`)
    ]);
    torneio.value = tournamentData;
    draw.value = drawData;
    if (drawData && drawData.matches) {
      results.value = drawData.matches.map((match: Match) => ({
        team1: match.result?.team1 ?? '',
        team2: match.result?.team2 ?? '',
      }));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar os dados: ${error.message}`;
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido ao carregar os dados.';
    }
  } finally {
    isLoading.value = false;
  }
}

async function submitResult(match: Match, index: number) {
  const result = results.value[index];
  if (result.team1 === '' || result.team2 === '') {
    alert('Por favor, preencha o resultado para ambas as duplas.');
    return;
  }
  isSubmitting.value[match.id] = true;
  try {
    const updatedDraw = await callApi(`/tournaments/${tournamentId}/results`, {
      method: 'PATCH',
      body: {
        matchId: match.id,
        result: { team1: Number(result.team1), team2: Number(result.team2) },
      },
    });
    draw.value = updatedDraw;
    if (updatedDraw && updatedDraw.matches) {
      results.value = updatedDraw.matches.map((m: Match) => ({
        team1: m.result?.team1 ?? '',
        team2: m.result?.team2 ?? '',
      }));
    }
    alert('Resultado salvo com sucesso!');
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Erro ao salvar o resultado: ${error.message}`);
    } else {
      alert('Ocorreu um erro desconhecido ao salvar o resultado.');
    }
  } finally {
    isSubmitting.value[match.id] = false;
  }
}

// Avançar para a próxima ronda
async function advanceRound() {
  isAdvancing.value = true;
  errorMessage.value = '';
  try {
    const updatedDraw = await callApi(`/tournaments/${tournamentId}/rounds`, {
      method: 'POST',
    });
    draw.value = updatedDraw; // Atualiza o draw com a nova ronda
     if (updatedDraw && updatedDraw.matches) {
      results.value = updatedDraw.matches.map((m: Match) => ({
        team1: m.result?.team1 ?? '',
        team2: m.result?.team2 ?? '',
      }));
    }
    alert('Próxima ronda gerada com sucesso!');
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Erro ao gerar a próxima ronda: ${error.message}`);
      errorMessage.value = `Erro ao gerar a próxima ronda: ${error.message}`;
    } else {
      alert('Ocorreu um erro desconhecido.');
      errorMessage.value = 'Ocorreu um erro desconhecido.';
    }
  } finally {
    isAdvancing.value = false;
  }
}

onMounted(fetchData);
</script>

<style scoped>
.gerenciar-resultados-container {
  max-width: 1000px;
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
  font-size: 2rem;
  margin: 0;
}
.voltar-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: var(--cor-texto-principal);
}
.feedback-container {
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.feedback-container.error {
    background-color: #f8d7da;
    color: #721c24;
}
.rodadas-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.rodada h4 {
  font-size: 1.2rem;
  text-transform: uppercase;
  color: #777;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}
.lista-jogos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.jogo-card {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  background-color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.dupla {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.dupla:nth-child(3) {
  justify-content: flex-end;
}
.vs {
  font-weight: bold;
  text-align: center;
}
.input-resultado {
  width: 60px;
  padding: 0.5rem;
  text-align: center;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.bye {
  font-style: italic;
  color: #999;
}
.nome-dupla {
    text-align: right;
    width: 100%;
}
.acao-salvar {
    padding-left: 1.5rem;
}
.btn-salvar {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.2s;
}
.btn-salvar:disabled {
  background-color: #28a745;
  cursor: not-allowed;
}
.btn-avancar-ronda {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  background-color: #fd9e02;
  color: white;
  transition: background-color 0.2s;
}
.btn-avancar-ronda:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
