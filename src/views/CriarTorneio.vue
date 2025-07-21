<template>
  <div class="criar-torneio-container">
    <div class="navegacao-voltar">
      <router-link to="/organizador/gerenciar-torneios" class="voltar-link">
        &larr; Voltar para Meus Torneios
      </router-link>
    </div>

    <h2 class="titulo">Criar Novo Torneio</h2>
    <p class="subtitulo">Preencha as informações abaixo para criar seu evento.</p>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="submeterFormulario" class="form-torneio">
      <div class="form-grupo">
        <label for="nome">Nome do Torneio</label>
        <input type="text" id="nome" v-model="form.name" required />
      </div>

      <div class="form-grupo">
        <label for="local">Local</label>
        <input type="text" id="local" v-model="form.location" required />
      </div>

      <div class="form-grupo-datas">
        <div class="form-grupo">
          <label for="data-inicio">Data de Início</label>
          <input type="date" id="data-inicio" v-model="form.dataInicio" required />
        </div>
        <div class="form-grupo">
          <label for="data-fim">Data de Fim</label>
          <input type="date" id="data-fim" v-model="form.dataFim" required />
        </div>
      </div>

      <!-- NOVO: Campo para Categoria -->
      <div class="form-grupo">
        <label for="category">Categoria do Torneio</label>
        <select id="category" v-model="form.category" required>
          <option value="Masculino - Duo">Masculino - Duo</option>
          <option value="Feminino - Duo">Feminino - Duo</option>
          <option value="Masculino - Solo">Masculino - Solo</option>
          <option value="Feminino - Solo">Feminino - Solo</option>
        </select>
      </div>

      <!-- NOVO: Campo para Formato da Partida -->
      <div class="form-grupo">
        <label for="matchFormat">Formato da Partida</label>
        <select id="matchFormat" v-model="form.matchFormat" required>
          <option value="bestOf3">Melhor de 3 Sets</option>
          <option value="bestOf1">Set Único</option>
        </select>
      </div>

      <button type="submit" class="btn-criar" :disabled="isLoading">
        {{ isLoading ? 'A Criar...' : 'Criar Torneio' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { callApi } from '../services/api'

const router = useRouter()

// Formulário atualizado com os novos campos
const form = ref({
  name: '',
  location: '',
  dataInicio: '',
  dataFim: '',
  category: 'Masculino - Duo', // Valor padrão
  matchFormat: 'bestOf3',   // Valor padrão
})

const isLoading = ref(false)
const errorMessage = ref('')

function formatarData(data: string): string {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

async function submeterFormulario() {
  isLoading.value = true
  errorMessage.value = ''

  // --- NOVA VALIDAÇÃO DE DATAS (no front-end) ---
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zera o horário para comparar apenas a data
  const dataInicio = new Date(form.value.dataInicio);
  const dataFim = new Date(form.value.dataFim);

  if (dataInicio < hoje) {
    errorMessage.value = 'A data de início não pode ser igual ou anterior ao dia de hoje.';
    isLoading.value = false;
    return;
  }
  if (dataFim < dataInicio) {
    errorMessage.value = 'A data de fim não pode ser anterior à data de início.';
    isLoading.value = false;
    return;
  }
  // -------------------------------------------

  try {
    // Prepara o objeto de dados para enviar para a API
    const dadosParaApi = {
      name: form.value.name,
      location: form.value.location,
      dates: `${formatarData(form.value.dataInicio)} a ${formatarData(form.value.dataFim)}`,
      category: form.value.category,
      matchFormat: form.value.matchFormat,
      // Estes campos não estão mais no formulário, mas a API os espera
      registrationFee: 0,
    }

    await callApi('/tournaments', {
      method: 'POST',
      body: dadosParaApi,
    });

    router.push('/organizador/gerenciar-torneios');

  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = `Falha ao criar o torneio: ${error.message}`;
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido ao criar o torneio.';
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Os seus estilos existentes mais alguns ajustes para o select */
.criar-torneio-container { max-width: 800px; margin: 2rem auto; padding: 2rem; }
.navegacao-voltar { margin-bottom: 1.5rem; }
.voltar-link { text-decoration: none; font-weight: bold; color: var(--cor-texto-principal); display: inline-block; }
.titulo { text-align: center; font-size: 2.2rem; margin-bottom: 0.5rem; }
.subtitulo { text-align: center; margin-bottom: 2.5rem; font-size: 1.1rem; opacity: 0.8; }
.form-torneio { background-color: white; padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
.form-grupo { margin-bottom: 1.5rem; }
.form-grupo label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
.form-grupo input, .form-grupo select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: white; /* Garante fundo branco para o select */
}
.form-grupo-datas { display: flex; gap: 1.5rem; }
.form-grupo-datas .form-grupo { flex: 1; }
.btn-criar { background-color: var(--cor-texto-principal); color: white; padding: 0.8rem 1.5rem; border: none; border-radius: 4px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 1rem; }
.btn-criar:disabled { background-color: #ccc; }
.error-message { background-color: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem; border: 1px solid #f5c6cb; }
</style>
