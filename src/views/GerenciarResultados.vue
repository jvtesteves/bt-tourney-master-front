<template>
  <div class="gerenciar-resultados-container">
    <div v-if="torneio">
      <router-link to="/gerenciar-torneios" class="voltar-link"
        >&larr; Voltar para Meus Torneios</router-link
      >
      <h2 class="titulo">Gerenciar Resultados: {{ torneio.nome }}</h2>

      <div v-if="jogos.length" class="lista-jogos">
        <div v-for="jogo in jogos" :key="jogo.id" class="jogo-card">
          <div class="dupla">
            <span>{{ jogo.dupla1.join(' & ') }}</span>
            <input
              type="number"
              v-model="jogo.resultado.dupla1"
              placeholder="Pts"
              class="input-resultado"
            />
          </div>
          <div class="vs">vs</div>
          <div class="dupla" v-if="jogo.dupla2">
            <input
              type="number"
              v-model="jogo.resultado.dupla2"
              placeholder="Pts"
              class="input-resultado"
            />
            <span>{{ jogo.dupla2.join(' & ') }}</span>
          </div>
          <div class="dupla" v-else>
            <span class="bye">BYE</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h2>Torneio não encontrado.</h2>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { torneios } from '../store'
import { chaves } from '../store/chaves'

const route = useRoute()
const torneioId = Number(route.params.id)

const torneio = computed(() => torneios.value.find((t) => t.id === torneioId))
// Acessa diretamente os jogos do torneio na store, que agora são reativos
const jogos = computed(() => chaves.value[torneioId] || [])

// Os resultados são salvos automaticamente graças ao v-model.
// Para um app real, teríamos um botão "Salvar" que faria uma chamada de API.
</script>

<style scoped>
.gerenciar-resultados-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
}
.titulo {
  margin-bottom: 2rem;
}
.voltar-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: var(--cor-texto-principal);
}
.lista-jogos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.jogo-card {
  display: flex;
  align-items: center;
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
}
.dupla:last-child {
  justify-content: flex-end;
}
.vs {
  font-weight: bold;
  margin: 0 1rem;
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
</style>
