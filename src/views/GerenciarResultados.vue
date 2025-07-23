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
        <h2 class="titulo">Gerir Resultados e Agendamentos: {{ torneio.name }}</h2>
        <button
          @click="advanceRound"
          :disabled="!canAdvanceRound || isAdvancing || isFinished"
          class="btn-avancar-ronda"
        >
          {{ isFinished ? 'Torneio Finalizado' : (isAdvancing ? 'A Processar...' : 'Avançar Ronda') }}
        </button>
      </div>

      <div v-if="isFinished && draw.champion" class="campeao-container">
        🏆 <strong>{{ isDuoCategory ? 'Campeões:' : 'Campeão:' }}</strong> {{ isDuoCategory ? draw.champion.team.join(' & ') : draw.champion.team[0] }} 🏆
      </div>

      <div class="rodadas-container">
        <div v-for="roundNumber in rounds" :key="roundNumber" class="rodada">
          <h4>Ronda {{ roundNumber }}</h4>
          <div class="lista-jogos">
            <div v-for="match in getMatchesForRound(roundNumber)" :key="match.id" class="jogo-card">
              <!-- Coluna 1: Informações das Duplas -->
              <div class="info-duplas">
                <div class="dupla">{{ isDuoCategory ? match.team1.team.join(' & ') : match.team1.team[0] }}</div>
                <div class="vs">vs</div>
                <div class="dupla" v-if="match.team2.id !== 'BYE'">{{ isDuoCategory ? match.team2.team.join(' & ') : match.team2.team[0] }}</div>
                <div class="dupla" v-else><span class="bye">BYE</span></div>
              </div>

              <!-- Coluna 2: Formulário de Agendamento -->
              <div class="form-agendamento">
                <div class="input-agendamento">
                  <label>Quadra</label>
                  <input type="text" v-model="schedules[getGlobalIndex(match.id)].court" :disabled="match.team2.id === 'BYE'" placeholder="Quadra">
                </div>
                <div class="input-agendamento">
                  <label>Horário</label>
                  <input type="time" v-model="schedules[getGlobalIndex(match.id)].time" :disabled="match.team2.id === 'BYE'">
                </div>
                <button @click="submitSchedule(match, getGlobalIndex(match.id))" :disabled="isSubmittingSchedule[match.id] || match.team2.id === 'BYE'" class="btn-agendar">
                  {{ isSubmittingSchedule[match.id] ? '...' : 'Agendar' }}
                </button>
              </div>

              <!-- Coluna 3: Formulário de Resultado -->
              <div class="form-resultado">
                <div class="sets-container">
                  <div v-for="setIndex in numberOfSets" :key="setIndex" class="set-input">
                    <label>S{{ setIndex }}</label>
                    <div class="pontos-input">
                      <input type="number" class="input-resultado" v-model="results[getGlobalIndex(match.id)].sets[setIndex - 1].team1" :disabled="match.winner !== null || isFinished" />
                      <input type="number" class="input-resultado" v-model="results[getGlobalIndex(match.id)].sets[setIndex - 1].team2" :disabled="match.winner !== null || match.team2.id === 'BYE' || isFinished" />
                    </div>
                  </div>
                </div>
                <button @click="submitResult(match, getGlobalIndex(match.id))" class="btn-salvar" :disabled="match.winner !== null || isSubmittingResult[match.id] || match.team2.id === 'BYE' || isFinished">
                  {{ isSubmittingResult[match.id] ? '...' : (match.winner ? 'Salvo' : 'Salvar') }}
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

interface Team { id: string; team: string[] }
interface SetResult { team1: number | null; team2: number | null }
interface Schedule { court: string; time: string }
interface Match {
  id: string;
  round: number;
  team1: Team;
  team2: Team;
  winner: 'team1' | 'team2' | null;
  result: { sets: SetResult[] } | null;
  schedule?: Schedule;
}
interface Draw {
  tournamentId: string;
  matches: Match[];
  champion?: Team;
}
interface Tournament { name: string; matchFormat: 'bestOf1' | 'bestOf3'; category: string; }
type LocalResult = { sets: { team1: number | string, team2: number | string }[] };
type LocalSchedule = { court: string, time: string };

const route = useRoute();
const tournamentId = route.params.id as string;

const torneio = ref<Tournament | null>(null);
const draw = ref<Draw | null>(null);
const results = ref<LocalResult[]>([]);
const schedules = ref<LocalSchedule[]>([]);
const isSubmittingResult = ref<Record<string, boolean>>({});
const isSubmittingSchedule = ref<Record<string, boolean>>({});
const isLoading = ref(true);
const errorMessage = ref('');
const isAdvancing = ref(false);

const rounds = computed(() => {
  if (!draw.value) return [];
  return [...new Set(draw.value.matches.map(m => m.round))].sort((a, b) => a - b);
});
const isFinished = computed(() => !!draw.value?.champion);
const canAdvanceRound = computed(() => {
  if (!draw.value || rounds.value.length === 0 || isFinished.value) return false;
  const lastRoundNumber = rounds.value[rounds.value.length - 1];
  const lastRoundMatches = draw.value.matches.filter(m => m.round === lastRoundNumber);
  return lastRoundMatches.every(m => m.winner !== null || m.team2.id === "BYE");
});
const numberOfSets = computed(() => {
  return torneio.value?.matchFormat === 'bestOf1' ? 1 : 3;
});
const isDuoCategory = computed(() => {
  return torneio.value?.category.toLowerCase().includes('duo') ?? false;
});

function getMatchesForRound(roundNumber: number): Match[] {
  return draw.value?.matches.filter(m => m.round === roundNumber) || [];
}
function getGlobalIndex(matchId: string): number {
  return draw.value?.matches.findIndex(m => m.id === matchId) ?? -1;
}

function initializeLocalData(matches: Match[]) {
  results.value = matches.map(match => {
    const localSets = [];
    for (let i = 0; i < numberOfSets.value; i++) {
      localSets.push({
        team1: match.result?.sets[i]?.team1 ?? '',
        team2: match.result?.sets[i]?.team2 ?? '',
      });
    }
    return { sets: localSets };
  });
  schedules.value = matches.map(match => ({
    court: match.schedule?.court ?? '',
    time: match.schedule?.time ?? '',
  }));
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
      initializeLocalData(drawData.matches);
    }
  } catch (error) {
    if (error instanceof Error) errorMessage.value = `Não foi possível carregar os dados: ${error.message}`;
    else errorMessage.value = 'Ocorreu um erro desconhecido.';
  } finally {
    isLoading.value = false;
  }
}

async function submitResult(match: Match, index: number) {
  const localSets = results.value[index].sets;
  const setsToSubmit = localSets
    .filter(s => s.team1 !== '' && s.team2 !== '')
    .map(s => ({ team1: Number(s.team1), team2: Number(s.team2) }));

  if (setsToSubmit.length === 0) {
    alert('Por favor, preencha o resultado de pelo menos um set.');
    return;
  }
  isSubmittingResult.value[match.id] = true;
  try {
    const updatedDraw = await callApi(`/tournaments/${tournamentId}/results`, {
      method: 'PATCH',
      body: { matchId: match.id, sets: setsToSubmit },
    });
    draw.value = updatedDraw;
    if (updatedDraw && updatedDraw.matches) initializeLocalData(updatedDraw.matches);
    alert('Resultado salvo com sucesso!');
  } catch (error) {
    if (error instanceof Error) alert(`Erro ao salvar o resultado: ${error.message}`);
    else alert('Ocorreu um erro desconhecido.');
  } finally {
    isSubmittingResult.value[match.id] = false;
  }
}

async function submitSchedule(match: Match, index: number) {
  const schedule = schedules.value[index];
  if (!schedule.court || !schedule.time) {
    alert('Por favor, preencha a quadra e o horário.');
    return;
  }
  isSubmittingSchedule.value[match.id] = true;
  try {
    const updatedDraw = await callApi(`/tournaments/${tournamentId}/schedule`, {
      method: 'PATCH',
      body: { matchId: match.id, schedule },
    });
    draw.value = updatedDraw;
    if (updatedDraw && updatedDraw.matches) initializeLocalData(updatedDraw.matches);
    alert('Agendamento salvo com sucesso!');
  } catch (error) {
    if (error instanceof Error) alert(`Erro ao salvar o agendamento: ${error.message}`);
    else alert('Ocorreu um erro desconhecido.');
  } finally {
    isSubmittingSchedule.value[match.id] = false;
  }
}

async function advanceRound() {
  isAdvancing.value = true;
  errorMessage.value = '';
  try {
    const updatedDraw = await callApi(`/tournaments/${tournamentId}/rounds`, { method: 'POST' });
    draw.value = updatedDraw;
    if (updatedDraw && updatedDraw.matches) initializeLocalData(updatedDraw.matches);
    alert('Próxima ronda gerada com sucesso!');
  } catch (error) {
    if (error instanceof Error) {
      alert(`Erro ao gerar a próxima ronda: ${error.message}`);
      errorMessage.value = `Erro ao gerar a próxima ronda: ${error.message}`;
    } else {
      alert('Ocorreu um erro desconhecido.');
    }
  } finally {
    isAdvancing.value = false;
  }
}

onMounted(fetchData);
</script>

<style scoped>
.gerenciar-resultados-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
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
.campeao-container {
  text-align: center;
  padding: 1.5rem;
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  font-size: 1.3rem;
  margin-bottom: 2rem;
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
  gap: 1.5rem;
}
.jogo-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  gap: 1.5rem;
}
.info-duplas {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
}
.dupla {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vs {
  font-weight: bold;
  color: var(--cor-destaque, #888);
  text-align: center;
}
.bye {
  font-style: italic;
  color: #999;
}
.form-agendamento {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding: 0 1.5rem;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  height: 100%;
}
.input-agendamento {
  display: flex;
  flex-direction: column;
}
.input-agendamento label {
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 0.3rem;
}
.input-agendamento input {
  border: 1px solid #ccc;
  padding: 0.6rem;
  border-radius: 4px;
}
.btn-agendar {
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.form-resultado {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}
.sets-container {
  display: flex;
  gap: 0.5rem;
}
.set-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}
.set-input label {
  font-size: 0.8rem;
  font-weight: bold;
  color: #777;
}
.pontos-input {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.input-resultado {
  width: 50px;
  padding: 0.5rem 0;
  text-align: center;
  font-size: 1.1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.set-input span {
  display: none;
}
.btn-salvar {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  background-color: #007bff;
  color: white;
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
}
.btn-avancar-ronda:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .form-agendamento {
    border-left: none;
    border-right: none;
    padding: 1.5rem 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin: 1.5rem 0;
    width: 100%;
    flex-basis: 100%;
    flex-direction: column;
    align-items: center;
  }
}
</style>
