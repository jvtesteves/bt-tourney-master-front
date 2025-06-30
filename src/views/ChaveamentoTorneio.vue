<template>
  <div class="chaveamento-container">
    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="feedback-container">
      <p>A carregar chaveamento...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
      <router-link to="/torneios" class="voltar-link">Voltar para a lista de torneios</router-link>
    </div>

    <!-- Conteúdo principal -->
    <div v-else-if="torneio && draw">
      <h2 class="titulo">{{ torneio.name }}</h2>
      <h3 class="subtitulo">Chaves do Torneio</h3>

      <div class="rodada">
        <h4>Primeira Rodada</h4>
        <div class="lista-jogos">
          <div v-for="match in draw.matches" :key="match.id" class="jogo-card">
            <div class="dupla" :class="{ vencedor: match.winner === 'team1' }">
              <span>{{ match.team1.team.join(' & ') }}</span>
              <strong v-if="match.result" class="resultado">{{ match.result.team1 }}</strong>
            </div>
            <div class="vs">vs</div>
            <div class="dupla" v-if="match.team2.id !== 'BYE'" :class="{ vencedor: match.winner === 'team2' }">
              <strong v-if="match.result" class="resultado">{{ match.result.team2 }}</strong>
              <span>{{ match.team2.team.join(' & ') }}</span>
            </div>
            <div class="dupla" v-else>
              <span class="bye">BYE (Avança)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { callPublicApi } from '../services/api'

// Define as interfaces para os dados que vêm da API
interface Team {
  id: string;
  team: string[];
}
interface Match {
  id: string;
  round: number;
  team1: Team;
  team2: Team;
  winner: 'team1' | 'team2' | null;
  result: { team1: number | null, team2: number | null } | null;
}
interface Draw {
  tournamentId: string;
  matches: Match[];
}
interface Tournament {
  name: string;
}

const route = useRoute()
const tournamentId = route.params.id as string

// Variáveis reativas para o estado da página
const torneio = ref<Tournament | null>(null)
const draw = ref<Draw | null>(null)
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
    // Busca os dados em paralelo para mais eficiência
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
.rodada h4 {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.dupla {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
}
.dupla:last-child {
  justify-content: flex-end;
}
.vs {
  font-weight: bold;
  color: var(--cor-destaque);
  margin: 0 1rem;
}
.bye {
  font-style: italic;
  color: #999;
}
.feedback-container, .sem-chaves, .torneio-nao-encontrado {
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
.voltar-link {
    margin-top: 1rem;
    display: inline-block;
    text-decoration: none;
    font-weight: bold;
}
</style>
