<template>
  <div class="gerenciar-container">
    <div class="header">
      <h2 class="titulo">Seus Torneios</h2>
      <router-link to="/organizador/criar-torneio" class="btn-novo-torneio">
        Criar Novo Torneio
      </router-link>
    </div>

    <div v-if="isLoading" class="sem-torneios">
      <p>A carregar torneios...</p>
    </div>
    <div v-else-if="errorMessage" class="sem-torneios error">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="tournaments.length === 0" class="sem-torneios">
      <p>Você ainda não criou nenhum torneio.</p>
    </div>

    <div v-else class="lista-torneios">
      <div v-for="torneio in tournaments" :key="torneio.id" class="torneio-card">
        <div class="card-content">
          <h3>{{ torneio.name }}</h3>
          <p><strong>Local:</strong> {{ torneio.location }}</p>
          <p><strong>Data:</strong> {{ torneio.dates }}</p>
        </div>
        <div class="card-actions">
          <router-link :to="`/organizador/gerenciar-torneios/${torneio.id}/inscricoes`" class="btn-acao">
            Gerir Inscrições
          </router-link>
          <button
            @click="handleDelete(torneio.id)"
            class="btn-acao btn-excluir"
            :disabled="isDeleting[torneio.id]"
          >
            {{ isDeleting[torneio.id] ? 'A Excluir...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { callApi } from '../services/api'

interface Tournament {
  id: string;
  name: string;
  dates: string;
  location: string;
  createdAt: string;
}

const tournaments = ref<Tournament[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const isDeleting = ref<Record<string, boolean>>({})

onMounted(async () => {
  try {
    const data = await callApi('/tournaments', { method: 'GET' })
    data.sort((a: Tournament, b: Tournament) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    tournaments.value = data
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = `Não foi possível carregar os torneios. ${error.message}`
    } else {
      errorMessage.value = `Ocorreu um erro desconhecido.`
    }
  } finally {
    isLoading.value = false
  }
})

async function handleDelete(tournamentId: string) {
  isDeleting.value[tournamentId] = true;
  try {
    await callApi(`/tournaments/${tournamentId}`, {
      method: 'DELETE',
    });
    tournaments.value = tournaments.value.filter(t => t.id !== tournamentId);
    alert('Torneio excluído com sucesso!');
  } catch (error) {
    if (error instanceof Error) {
      alert(`Erro ao excluir o torneio: ${error.message}`);
    } else {
      alert('Ocorreu um erro desconhecido ao excluir o torneio.');
    }
  } finally {
    isDeleting.value[tournamentId] = false;
  }
}
</script>

<style scoped>
.gerenciar-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
.titulo { font-size: 2.2rem; margin: 0; }
.btn-novo-torneio { background-color: var(--cor-texto-principal); color: white; padding: 0.8rem 1.5rem; border-radius: 4px; text-decoration: none; font-weight: bold; }
.sem-torneios { text-align: center; padding: 3rem; background-color: white; border-radius: 8px; }
.sem-torneios.error { background-color: #f8d7da; color: #721c24; }
.lista-torneios { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
.torneio-card { background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; justify-content: space-between; }
.card-content { padding: 1.5rem; }
.torneio-card h3 { margin-top: 0; }
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
  transition: background-color 0.2s;
  /* ATUALIZAÇÃO: Padroniza o tamanho da letra e o alinhamento */
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-acao:hover { background-color: #f0f0f0; }
.btn-excluir {
  border-color: #dc3545;
  color: #dc3545;
}
.btn-excluir:hover {
  background-color: #dc3545;
  color: white;
}
.btn-excluir:disabled {
  border-color: #ccc;
  color: #ccc;
  background-color: transparent;
  cursor: not-allowed;
}
</style>
