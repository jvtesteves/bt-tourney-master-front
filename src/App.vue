<script setup lang="ts">
import AppCabecalho from './components/AppCabecalho.vue'
</script>

<template>
  <div id="app-wrapper">
    <AppCabecalho />
    <main>
      <!-- O Vue Router renderizará o componente da rota atual aqui -->
      <router-view />
    </main>
  </div>
</template>

<style>
/* Estilos globais para o wrapper do app */
#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
