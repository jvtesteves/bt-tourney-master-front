<template>
  <div class="gerenciar-container">
    <div class="header">
      <h2 class="titulo">Seus Torneios</h2>
      <router-link to="/organizador/criar-torneio" class="btn-novo-torneio">
        Criar Novo Torneio
      </router-link>
    </div>

    <!-- Mensagem de carregamento -->
    <div v-if="isLoading" class="sem-torneios">
      <p>A carregar torneios...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="errorMessage" class="sem-torneios error">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Mensagem para quando não há torneios -->
    <div v-else-if="tournaments.length === 0" class="sem-torneios">
      <p>Você ainda não criou nenhum torneio.</p>
    </div>

    <!-- Lista de torneios obtida da API -->
    <div v-else class="lista-torneios">
      <div v-for="torneio in tournaments" :key="torneio.id" class="torneio-card">
        <div class="card-content">
          <!-- Usamos as propriedades retornadas pela API: name, location, dates -->
          <h3>{{ torneio.name }}</h3>
          <p><strong>Local:</strong> {{ torneio.location }}</p>
          <p><strong>Data:</strong> {{ torneio.dates }}</p>
        </div>
        <div class="card-actions">
           <!-- Links para as outras páginas de gestão -->
          <router-link :to="`/organizador/gerenciar-torneios/${torneio.id}/inscricoes`" class="btn-acao">
            Ver Inscrições
          </router-link>
          <router-link :to="`/organizador/gerenciar-torneios/${torneio.id}/resultados`" class="btn-acao">
            Resultados
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { callApi } from '../services/api'

// Define o tipo para um objeto de torneio, espelhando o que a API retorna
interface Tournament {
  id: string;
  name: string;
  dates: string;
  location: string;
}

// Variáveis reativas para controlar o estado do componente
const tournaments = ref<Tournament[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// onMounted é executado assim que o componente é montado no ecrã.
onMounted(async () => {
  try {
    // Chama a API para obter a lista de torneios
    const data = await callApi('/tournaments', { method: 'GET' })
    tournaments.value = data
  } catch (error: unknown) {
    console.error("Falha ao obter a lista de torneios:", error)
    if (error instanceof Error) {
        errorMessage.value = `Não foi possível carregar os torneios. ${error.message}`
    } else {
        errorMessage.value = 'Ocorreu um erro desconhecido ao carregar os torneios.'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.gerenciar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}
.titulo {
  font-size: 2.2rem;
  margin: 0;
}
.btn-novo-torneio {
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}
.sem-torneios {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
}
.sem-torneios.error {
    background-color: #f8d7da;
    color: #721c24;
}
.lista-torneios {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.torneio-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
}
.torneio-card:hover {
    transform: translateY(-5px);
}
.card-content {
  padding: 1.5rem;
}
.torneio-card h3 {
  margin-top: 0;
}
.card-actions {
  padding: 1rem 1.5rem;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
  text-align: right;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.btn-acao {
  background: none;
  border: 1px solid var(--cor-texto-principal);
  color: var(--cor-texto-principal);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
}
.btn-acao:hover {
  background-color: var(--cor-destaque, #e0e0e0);
}
</style>
