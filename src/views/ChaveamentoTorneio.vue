<template>
  <div class="chaveamento-container">
    <div class="navegacao-voltar">
      <router-link v-if="auth.tipoDeUtilizador.value === 'organizador'" to="/organizador/gerenciar-torneios" class="voltar-link">
        &larr; Voltar para Meus Torneios
      </router-link>
      <router-link v-else-if="auth.tipoDeUtilizador.value === 'jogador'" to="/jogador/dashboard" class="voltar-link">
        &larr; Voltar para Meu Painel
      </router-link>
      <router-link v-else to="/torneios" class="voltar-link">
        &larr; Voltar para a Lista de Torneios
      </router-link>
    </div>

    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="feedback-container">
      <p>A carregar chaveamento...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Conteúdo principal -->
    <div v-else-if="torneio && draw">
      <h2 class="titulo">{{ torneio.name }}</h2>
      <h3 class="subtitulo">Chaves do Torneio - {{ torneio.category }}</h3>

      <div class="rodada">
        <div v-for="roundNumber in rounds" :key="roundNumber" class="rodada-content">
          <h4>Ronda {{ roundNumber }}</h4>
          <div class="lista-jogos">
            <div v-for="match in getMatchesForRound(roundNumber)" :key="match.id" class="jogo-card">
              <div class="info-duplas">
                <div class="dupla" :class="{ vencedor: match.winner === 'team1' }">
                  <span>{{ isDuoCategory ? match.team1.team.join(' & ') : match.team1.team[0] }}</span>
                  <strong v-if="match.result" class="resultado">{{ getSetScore(match).team1 }}</strong>
                </div>
                <div class="vs">vs</div>
                <div class="dupla" v-if="match.team2.id !== 'BYE'" :class="{ vencedor: match.winner === 'team2' }">
                  <strong v-if="match.result" class="resultado">{{ getSetScore(match).team2 }}</strong>
                  <span>{{ isDuoCategory ? match.team2.team.join(' & ') : match.team2.team[0] }}</span>
                </div>
                <div class="dupla" v-else>
                  <span class="bye">BYE (Avança)</span>
                </div>
              </div>

              <div v-if="match.schedule" class="info-agendamento">
                <span class="info-item">
                  <strong>Quadra:</strong> {{ match.schedule.court }}
                </span>
                <span class="info-item">
                  <strong>Horário:</strong> {{ match.schedule.time }}
                </span>
              </div>
              <div v-else-if="match.team2.id !== 'BYE'" class="info-agendamento">
                 <span class="info-item a-definir">A definir</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div v-if="auth.tipoDeUtilizador.value === 'organizador'" class="acoes-rodape">
        <router-link :to="`/organizador/gerenciar-torneios/${tournamentId}/resultados`" class="btn-acao">
          Gerir Resultados e Agendamentos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { callPublicApi } from '../services/api'
import { useAuth } from '../store/auth'

// Interfaces
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
interface Draw { tournamentId: string; matches: Match[] }
interface Tournament { name: string; category: string; }

const route = useRoute()
const auth = useAuth()
const tournamentId = route.params.id as string

const torneio = ref<Tournament | null>(null)
const draw = ref<Draw | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const rounds = computed(() => {
  if (!draw.value) return [];
  return [...new Set(draw.value.matches.map(m => m.round))].sort((a, b) => a - b);
});

// Propriedade computada para verificar se a categoria é 'Duo'
const isDuoCategory = computed(() => {
  return torneio.value?.category.toLowerCase().includes('duo') ?? false;
});

function getMatchesForRound(roundNumber: number): Match[] {
  return draw.value?.matches.filter(m => m.round === roundNumber) || [];
}

function getSetScore(match: Match): { team1: number; team2: number } {
  if (!match.result || !match.result.sets) {
    return { team1: 0, team2: 0 };
  }
  let team1SetWins = 0;
  let team2SetWins = 0;
  for (const set of match.result.sets) {
    if (typeof set.team1 === 'number' && typeof set.team2 === 'number') {
      if (set.team1 > set.team2) team1SetWins++;
      else if (set.team2 > set.team1) team2SetWins++;
    }
  }
  return { team1: team1SetWins, team2: team2SetWins };
}

onMounted(async () => {
  if (!tournamentId) {
    errorMessage.value = "ID do torneio não encontrado no URL."
    isLoading.value = false
    return
  }
  try {
    const [tournamentData, drawData] = await Promise.all([
      callPublicApi(`/public/tournaments/${tournamentId}`),
      callPublicApi(`/public/tournaments/${tournamentId}/draw`)
    ]);
    torneio.value = tournamentData
    draw.value = drawData
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar o chaveamento: ${error.message}`
    } else {
      errorMessage.value = "Ocorreu um erro desconhecido."
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.chaveamento-container {
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
  text-align: center;
  font-size: 2.5rem;
}
.subtitulo {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: #555;
}
.rodada-content h4 {
  font-size: 1.2rem;
  text-transform: uppercase;
  color: #777;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}
.lista-jogos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.jogo-card {
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.info-duplas {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.dupla {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.1rem;
}
.vs {
  font-weight: bold;
  color: var(--cor-destaque);
  text-align: center;
}
.bye {
  font-style: italic;
  color: #999;
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
.resultado {
  font-size: 1.3rem;
  font-weight: bold;
}
.vencedor {
  font-weight: bold;
  color: #2a9d8f;
}
.acoes-rodape {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.btn-acao {
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.info-agendamento {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #333;
}
.info-item {
  background-color: #f0f2f5;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
}
.info-item.a-definir {
  font-style: italic;
  color: #777;
  background-color: transparent;
}

@media (max-width: 768px) {
  .jogo-card {
    grid-template-columns: 1fr;
  }
  .info-duplas {
    flex-direction: column;
    align-items: center;
  }
  .vs {
    margin: 1rem 0;
  }
  .info-agendamento {
    align-items: center;
  }
  .acoes-rodape {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}
</style>
