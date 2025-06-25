<template>
  <div class="criar-torneio-container">
    <h2 class="titulo">Criar Novo Torneio</h2>
    <p class="subtitulo">Preencha as informações abaixo para criar seu evento.</p>

    <form @submit.prevent="submeterFormulario" class="form-torneio">
      <div class="form-grupo">
        <label for="nome">Nome do Torneio</label>
        <input type="text" id="nome" v-model="form.nome" required />
      </div>

      <div class="form-grupo">
        <label for="local">Local</label>
        <input type="text" id="local" v-model="form.local" required />
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

      <button type="submit" class="btn-criar">Criar Torneio</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { torneios, type Torneio } from '../store' // Importa a store e o tipo Torneio

const router = useRouter()

// Tipifica o formulário. Usamos 'Omit' para criar um tipo baseado em 'Torneio'
// mas sem a propriedade 'id', que será gerada depois.
type FormularioTorneio = Omit<Torneio, 'id'>

const form = ref<FormularioTorneio>({
  nome: '',
  local: '',
  dataInicio: '',
  dataFim: '',
})

function submeterFormulario() {
  const novoTorneio: Torneio = {
    id: Date.now(), // Adiciona o ID no momento da criação
    ...form.value,
  }

  torneios.value.push(novoTorneio)

  // Redireciona o utilizador para a página de gerenciamento correta
  router.push('/organizador/gerenciar-torneios')
}
</script>

<style scoped>
/* Seus estilos continuam os mesmos */
.criar-torneio-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.titulo {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}
.subtitulo {
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
  opacity: 0.8;
}
.form-torneio {
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
}
.btn-criar:hover {
  background-color: #333;
}
</style>
