<template>
  <header class="cabecalho">
    <div class="container">
      <router-link to="/" class="logo">BT Tourney Master</router-link>
      <nav class="navegacao">
        <router-link to="/torneios">Ver Torneios</router-link>

        <!-- Links do Organizador -->
        <router-link v-if="tipoDeUtilizador === 'organizador'" to="/organizador/dashboard">
          Dashboard Org.
        </router-link>

        <!-- Links do Jogador -->
        <router-link v-if="tipoDeUtilizador === 'jogador'" to="/jogador/dashboard">
          Meu Painel
        </router-link>

        <!-- Links de Login -->
        <template v-if="!estaLogado">
          <router-link to="/login/jogador">Login Jogador</router-link>
          <router-link to="/login/organizador">Login Org.</router-link>
        </template>

        <!-- Botão de Logout -->
        <a v-if="estaLogado" @click="fazerLogout" class="logout-link"> Sair </a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'

const { estaLogado, tipoDeUtilizador, logout } = useAuth()
const router = useRouter()

// Função async para aguardar a finalização do logout da AWS
async function fazerLogout() {
  await logout()
  router.push('/')
}
</script>

<style scoped>
.cabecalho {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  width: 100%;
  z-index: 10;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--cor-texto-principal);
  text-decoration: none;
}
.navegacao {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.navegacao a {
  text-decoration: none;
  color: var(--cor-texto-principal);
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  white-space: nowrap;
}
.navegacao a:hover,
.navegacao a.router-link-exact-active {
  background-color: var(--cor-destaque);
}
.logout-link {
  cursor: pointer;
}

/* --- Estilos para Dispositivos Móveis --- */
@media (max-width: 850px) {
  .container {
    flex-direction: column;
    gap: 1rem;
  }
  .navegacao {
    flex-wrap: wrap;
    justify-content: center;
  }
  .logo {
    font-size: 1.2rem;
  }
  .navegacao a {
    font-size: 0.9rem;
  }
}
</style>
