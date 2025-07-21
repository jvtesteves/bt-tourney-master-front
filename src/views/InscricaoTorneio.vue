<template>
  <div class="inscricao-container">
    <div class="navegacao-voltar">
       <router-link :to="`/torneio/${tournamentId}`" class="voltar-link">
        &larr; Voltar para os Detalhes do Torneio
      </router-link>
    </div>

    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="feedback-container">
      <p>A carregar informações do torneio...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="feedback-container error">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Formulário de Inscrição -->
    <div v-else-if="torneio" class="conteudo-inscricao">
      <h2 class="titulo">Inscrição no Torneio</h2>
      <h3 class="nome-torneio">{{ torneio.name }}</h3>
      <p class="subtitulo"><strong>Categoria:</strong> {{ torneio.category }}</p>

      <form @submit.prevent="submeterInscricao" class="form-inscricao">
        <!-- NOVO: O campo de parceiro só aparece para categorias 'Duo' -->
        <div v-if="isDuoCategory" class="form-grupo">
          <label for="parceiro">Nome do Parceiro(a)</label>
          <input type="text" id="parceiro" v-model="form.partnerName" required />
        </div>

        <p v-else class="info-solo">A sua inscrição será individual para a categoria Solo.</p>

        <button type="submit" class="btn-confirmar" :disabled="isSubmitting">
          {{ isSubmitting ? 'A Inscrever...' : 'Confirmar Inscrição' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { callPublicApi, callApi } from '../services/api'

// Interface atualizada
interface Tournament {
  id: string;
  name: string;
  category: string;
}

const route = useRoute()
const router = useRouter()
const tournamentId = route.params.id as string

// Estado
const torneio = ref<Tournament | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const form = ref({
  partnerName: '',
})
const isSubmitting = ref(false)

// Propriedade computada para verificar se a categoria é 'Duo'
const isDuoCategory = computed(() => {
  return torneio.value?.category.toLowerCase().includes('duo') ?? false;
});

onMounted(async () => {
  try {
    const data = await callPublicApi(`/public/tournaments/${tournamentId}`)
    torneio.value = data
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar os dados do torneio: ${error.message}`
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.'
    }
  } finally {
    isLoading.value = false
  }
})

async function submeterInscricao() {
  if (!torneio.value) return;

  // Validação para garantir que o nome do parceiro é preenchido se for uma categoria Duo
  if (isDuoCategory.value && !form.value.partnerName) {
      alert('Por favor, preencha o nome do seu parceiro(a).');
      return;
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const inscriptionData = {
      tournamentId: torneio.value.id,
      tournamentName: torneio.value.name,
      // A categoria é a do torneio
      category: torneio.value.category,
      // O nome do parceiro é enviado apenas se for uma categoria Duo
      partnerName: isDuoCategory.value ? form.value.partnerName : '',
    }
    await callApi('/inscriptions', {
      method: 'POST',
      body: inscriptionData,
    })
    router.push('/inscricao-confirmada')
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = `Erro ao realizar inscrição: ${error.message}`
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.inscricao-container { max-width: 800px; margin: 2rem auto; padding: 2rem; }
.navegacao-voltar { margin-bottom: 1.5rem; }
.voltar-link { text-decoration: none; font-weight: bold; color: var(--cor-texto-principal); display: inline-block; }
.feedback-container { text-align: center; padding: 3rem; background-color: #f9f9f9; border-radius: 8px; }
.feedback-container.error { background-color: #f8d7da; color: #721c24; }
.conteudo-inscricao { background-color: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
.titulo { font-size: 2.2rem; text-align: center; }
.nome-torneio { font-size: 1.5rem; text-align: center; color: var(--cor-texto-principal); margin-top: 0.5rem; }
.subtitulo { text-align: center; font-size: 1.1rem; opacity: 0.8; margin-bottom: 2rem; }
.form-inscricao { padding-top: 1rem; }
.form-grupo { margin-bottom: 1.5rem; }
.form-grupo label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
.form-grupo input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
.info-solo {
  text-align: center;
  font-style: italic;
  color: #555;
  margin-bottom: 1.5rem;
}
.btn-confirmar { width: 100%; background-color: var(--cor-texto-principal); color: white; padding: 0.8rem 1.5rem; border: none; border-radius: 4px; font-size: 1rem; font-weight: bold; cursor: pointer; }
.btn-confirmar:disabled { background-color: #ccc; }
</style>
