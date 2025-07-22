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

      <div class="info-adicional">
        <span class="info-tag"><strong>Categoria:</strong> {{ torneio.category }}</span>
        <span class="info-tag"><strong>Formato:</strong> {{ formatMatchFormat(torneio.matchFormat) }}</span>
      </div>

      <div class="acoes-principais">
        <!-- ATUALIZAÇÃO: A lógica para mostrar o botão agora inclui as novas regras -->
        <router-link
          v-if="auth.tipoDeUtilizador.value !== 'organizador' && !inscricoesEncerradas"
          :to="`/torneio/${torneio.id}/inscrever`"
          class="btn-inscrever"
        >
          Inscrever-se agora
        </router-link>
        <!-- Mensagem para quando as inscrições estão encerradas -->
        <p v-if="inscricoesEncerradas" class="inscricoes-encerradas">
          {{ mensagemEncerramento }}
        </p>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { callPublicApi } from '../services/api'
import { useAuth } from '../store/auth'

// Interfaces
interface Draw { matches: object[] }
interface Tournament {
  id: string;
  name: string;
  location: string;
  dates: string;
  category: string;
  matchFormat: 'bestOf1' | 'bestOf3';
}

const route = useRoute()
const auth = useAuth()
const tournamentId = route.params.id as string

// Estado
const torneio = ref<Tournament | null>(null)
const draw = ref<Draw | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

// Propriedades computadas para as regras
const chavesForamGeradas = computed(() => !!draw.value);

const dataDeInicioPassou = computed(() => {
  if (!torneio.value?.dates) return false;
  const dateParts = torneio.value.dates.split(' a ');
  const [startDay, startMonth, startYear] = dateParts[0].split('/');
  const startDate = new Date(Number(startYear), Number(startMonth) - 1, Number(startDay));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return startDate <= today;
});

const inscricoesEncerradas = computed(() => chavesForamGeradas.value || dataDeInicioPassou.value);

const mensagemEncerramento = computed(() => {
  if (chavesForamGeradas.value) {
    return "As inscrições estão encerradas, pois o chaveamento já foi gerado.";
  }
  if (dataDeInicioPassou.value) {
    return "As inscrições estão encerradas, pois o torneio já começou ou começa hoje.";
  }
  return "As inscrições para este torneio estão encerradas.";
});

function formatMatchFormat(format: string): string {
  if (format === 'bestOf3') return 'Melhor de 3 Sets';
  if (format === 'bestOf1') return 'Set Único';
  return format;
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
      callPublicApi(`/public/tournaments/${tournamentId}/draw`).catch(() => null)
    ]);
    torneio.value = tournamentData;
    draw.value = drawData;
  } catch (error) {
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
  margin-bottom: 1rem;
}
.info-adicional {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.info-tag {
  background-color: #eef2f7;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.9rem;
}
.acoes-principais {
  text-align: center;
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
}
.btn-inscrever, .btn-ver-chaves {
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
.inscricoes-encerradas {
  font-size: 1rem;
  font-style: italic;
  color: #777;
  background-color: #f0f2f5;
  padding: 1rem 2rem;
  border-radius: 4px;
}
</style>
