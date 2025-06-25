<template>
  <div class="confirmacao-container">
    <h2>Inscrição Realizada com Sucesso!</h2>
    <p>Boa sorte no torneio! Em breve você receberá mais informações.</p>
    <router-link to="/torneios" class="btn-link">Ver outros torneios</router-link>
  </div>
</template>

<style scoped>
.confirmacao-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
}
h2 {
  font-size: 2.2rem;
}
.btn-link {
  display: inline-block;
  margin-top: 1.5rem;
  background-color: var(--cor-texto-principal);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}
</style>
