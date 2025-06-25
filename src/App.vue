<script setup>
import Cabecalho from './components/Cabecalho.vue';
</script>

<template>
  <div id="app-wrapper">
    <Cabecalho />
    <main>
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