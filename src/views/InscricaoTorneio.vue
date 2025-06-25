<template>
  <div class="inscricao-container">
    <div v-if="torneio">
      <h2 class="titulo">Inscrição para: {{ torneio.nome }}</h2>
      <p class="subtitulo">Preencha os dados da dupla para confirmar a participação.</p>

      <form @submit.prevent="realizarInscricao" class="form-inscricao">
        <div class="form-grupo">
          <label for="jogador1">Nome do Jogador 1</label>
          <input type="text" id="jogador1" v-model="form.jogador1" required />
        </div>
        <div class="form-grupo">
          <label for="jogador2">Nome do Jogador 2</label>
          <input type="text" id="jogador2" v-model="form.jogador2" required />
        </div>
        <button type="submit" class="btn-confirmar">Confirmar Inscrição</button>
      </form>
    </div>
    <div v-else class="torneio-nao-encontrado">
      <h2>Torneio não encontrado</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { torneios } from '../store'
import { inscricoes } from '../store/inscricoes'

const route = useRoute()
const router = useRouter()
const torneioId = Number(route.params.id)

const torneio = computed(() => torneios.value.find((t) => t.id === torneioId))

const form = ref({
  jogador1: '',
  jogador2: '',
})

function realizarInscricao() {
  const novaInscricao = {
    id: Date.now(),
    torneioId: torneioId,
    nomeTorneio: torneio.value.nome,
    dupla: [form.value.jogador1, form.value.jogador2],
  }
  inscricoes.value.push(novaInscricao)
  console.log('Nova Inscrição:', novaInscricao)
  router.push('/inscricao-confirmada')
}
</script>

<style scoped>
.inscricao-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}
.titulo {
  font-size: 2.2rem;
}
.subtitulo {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}
.form-inscricao {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.form-grupo {
  margin-bottom: 1.5rem;
}
.form-grupo label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.form-grupo input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}
.btn-confirmar {
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
</style>
