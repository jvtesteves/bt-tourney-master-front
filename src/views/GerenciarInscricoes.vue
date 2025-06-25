<template>
  <div class="gerenciar-inscricoes-container">
    <div v-if="torneio">
      <router-link to="/gerenciar-torneios" class="voltar-link"
        >&larr; Voltar para Meus Torneios</router-link
      >
      <div class="header">
        <h2 class="titulo">Inscrições para: {{ torneio.nome }}</h2>
        <button
          v-if="!chavesForamGeradas && inscricoesDoTorneio.length > 1"
          @click="gerarChaves"
          class="btn-gerar-chaves"
        >
          Gerar Chaves
        </button>
        <router-link
          v-if="chavesForamGeradas"
          :to="`/torneio/${torneioId}/chaves`"
          class="btn-ver-chaves"
        >
          Ver Chaves
        </router-link>
      </div>

      <div v-if="inscricoesDoTorneio.length > 0" class="lista-inscricoes">
        <div v-for="inscricao in inscricoesDoTorneio" :key="inscricao.id" class="inscricao-card">
          <p><strong>Dupla:</strong> {{ inscricao.dupla.join(' e ') }}</p>
        </div>
      </div>
      <div v-else class="sem-inscricoes">
        <p>Ainda não há nenhuma inscrição para este torneio.</p>
      </div>
    </div>
    <div v-else class="torneio-nao-encontrado">
      <h2>Torneio não encontrado.</h2>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { torneios } from '../store'
import { inscricoes } from '../store/inscricoes'
import { chaves } from '../store/chaves'

const route = useRoute()
const router = useRouter()
const torneioId = Number(route.params.id)

const torneio = computed(() => torneios.value.find((t) => t.id === torneioId))
const inscricoesDoTorneio = computed(() =>
  inscricoes.value.filter((i) => i.torneioId === torneioId),
)
const chavesForamGeradas = computed(() => !!chaves.value[torneioId])

function gerarChaves() {
  const duplas = inscricoesDoTorneio.value.map((i) => i.dupla)

  for (let i = duplas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[duplas[i], duplas[j]] = [duplas[j], duplas[i]]
  }

  const jogos = []
  for (let i = 0; i < duplas.length; i += 2) {
    const jogo = {
      id: i / 2, // ID único para o jogo dentro do torneio
      dupla1: duplas[i],
      dupla2: duplas[i + 1] || null,
      // 1. Adiciona a estrutura para o resultado
      resultado: {
        dupla1: null,
        dupla2: null,
      },
    }
    jogos.push(jogo)
  }

  chaves.value[torneioId] = jogos
  router.push(`/gerenciar-torneios/${torneioId}/resultados`) // Leva direto para gerenciar resultados
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
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.inscricao-card p {
  margin: 0;
  font-size: 1.1rem;
}
.sem-inscricoes,
.torneio-nao-encontrado {
  background-color: white;
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
}
.btn-gerar-chaves,
.btn-ver-chaves {
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
</style>
