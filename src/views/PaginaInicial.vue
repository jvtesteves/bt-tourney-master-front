<template>
  <div class="pagina-inicial-container">
    <h1 class="titulo">Bem-vindo ao BT Tourney Master</h1>
    <p class="subtitulo">A sua plataforma completa para torneios de Beach Tennis.</p>
    <div class="botoes-acesso">
      <router-link to="/login/organizador" class="btn-acesso organizador">
        Sou Organizador
      </router-link>
      <router-link to="/login/jogador" class="btn-acesso jogador"> Sou Jogador </router-link>
      <router-link to="/torneios" class="btn-acesso publico"> Ver Torneios </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nenhum script necessário para esta página estática
</script>

<style scoped>
.pagina-inicial-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: calc(100vh - 120px);
  padding: 1rem;
}
.titulo {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.subtitulo {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 3rem;
  max-width: 500px;
}
.botoes-acesso {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}
.btn-acesso {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.btn-acesso:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.organizador {
  background-color: var(--cor-texto-principal);
}
.jogador {
  background-color: #2a9d8f;
}
.publico {
  background-color: #f4a261;
}

@media (max-width: 768px) {
  .titulo {
    font-size: 2.2rem;
  }
  .subtitulo {
    font-size: 1rem;
  }
  .btn-acesso {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
    width: 100%;
    max-width: 300px;
  }
}
</style>
