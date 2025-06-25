<template>
  <div class="chaveamento-container">
    <div v-if="torneio">
      <h2 class="titulo">{{ torneio.nome }}</h2>
      <h3 class="subtitulo">Chaves do Torneio</h3>

      <div v-if="jogosDaRodada.length" class="rodada">
        <h4>Primeira Rodada</h4>
        <div class="lista-jogos">
          <div v-for="jogo in jogosDaRodada" :key="jogo.id" class="jogo-card">
            <div class="dupla" :class="{ vencedor: ehVencedor(jogo, 1) }">
              <span>{{ jogo.dupla1.join(' & ') }}</span>
              <strong class="resultado">{{ jogo.resultado.dupla1 }}</strong>
            </div>
            <div class="vs">vs</div>
            <div class="dupla" v-if="jogo.dupla2" :class="{ vencedor: ehVencedor(jogo, 2) }">
              <strong class="resultado">{{ jogo.resultado.dupla2 }}</strong>
              <span>{{ jogo.dupla2.join(' & ') }}</span>
            </div>
            <div class="dupla" v-else>
              <span class="bye">BYE (Avança)</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="sem-chaves">
        <p>As chaves para este torneio ainda não foram geradas.</p>
      </div>
    </div>
    <div v-else class="torneio-nao-encontrado">
      <h2>Torneio não encontrado.</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { torneios, type Torneio } from '../store' // Importa o tipo Torneio
import { chaves } from '../store/chaves'
import type { Jogo } from '../store/chaves' // Importa o tipo Jogo

const route = useRoute()
const torneioId = Number(route.params.id)

const torneio = computed(() => torneios.value.find((t: Torneio) => t.id === torneioId))
const jogosDaRodada = computed(() => chaves.value[torneioId] || [])

// Função para determinar o vencedor e aplicar um estilo
function ehVencedor(jogo: Jogo, numeroDupla: number): boolean {
  const res1 = jogo.resultado.dupla1
  const res2 = jogo.resultado.dupla2
  if (res1 === null || res2 === null) return false

  if (numeroDupla === 1) return res1 > res2
  if (numeroDupla === 2) return res2 > res1
  return false
}
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
.sem-chaves,
.torneio-nao-encontrado {
  text-align: center;
  padding: 2rem;
}
.resultado {
  font-size: 1.3rem;
  font-weight: bold;
}
.vencedor {
  font-weight: bold;
  color: #2a9d8f;
} /* Cor para o vencedor */
</style>
