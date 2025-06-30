<template>
  <div class="criar-torneio-container">
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

      <!-- Layout de datas restaurado -->
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
const form = ref({
  name: '',
  location: '',
  dataInicio: '',
  dataFim: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

// Função para formatar a data para o padrão dd/mm/yyyy
function formatarData(data: string): string {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

async function submeterFormulario() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Prepara o objeto de dados para enviar para a API
    const dadosParaApi = {
      name: form.value.name,
      location: form.value.location,
      // Combina as datas numa única string, como o back-end espera
      dates: `${formatarData(form.value.dataInicio)} a ${formatarData(form.value.dataFim)}`,
      categories: 'A ser definida',
      registrationFee: 0,
    }

    const novoTorneio = await callApi('/tournaments', {
      method: 'POST',
      body: dadosParaApi,
    });

    console.log('Torneio criado com sucesso:', novoTorneio);

    router.push('/organizador/gerenciar-torneios');

  } catch (error: unknown) {
    console.error("Erro ao submeter o formulário:", error);
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
/* Seus estilos originais, que correspondem à imagem */
.criar-torneio-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}
.titulo {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}
.subtitulo {
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
  opacity: 0.8;
}
.form-torneio {
  background-color: white;
  padding: 2.5rem;
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
.form-grupo-datas {
  display: flex;
  gap: 1.5rem;
}
.form-grupo-datas .form-grupo {
  flex: 1;
}
.btn-criar {
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}
.btn-criar:hover {
  background-color: #333;
}
.btn-criar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid #f5c6cb;
}
</style>
