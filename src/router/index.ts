import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../store/auth'
import PaginaInicial from '../views/PaginaInicial.vue'
import LoginOrganizador from '../views/LoginOrganizador.vue'
import LoginJogador from '../views/LoginJogador.vue'
import DashboardJogador from '../views/DashboardJogador.vue'
import TelaPrincipalOrganizador from '../views/TelaPrincipalOrganizador.vue'
import CriarTorneio from '../views/CriarTorneio.vue'
import GerenciarTorneios from '../views/GerenciarTorneios.vue'
import GerenciarInscricoes from '../views/GerenciarInscricoes.vue'
import GerenciarResultados from '../views/GerenciarResultados.vue'
import ListaPublicaTorneios from '../views/ListaPublicaTorneios.vue'
import DetalhesTorneio from '../views/DetalhesTorneio.vue'
import InscricaoTorneio from '../views/InscricaoTorneio.vue'
import InscricaoConfirmada from '../views/InscricaoConfirmada.vue'
import ChaveamentoTorneio from '../views/ChaveamentoTorneio.vue'

const routes = [
  // Rotas Públicas e de Login
  { path: '/', name: 'PaginaInicial', component: PaginaInicial },
  {
    path: '/login/organizador',
    name: 'LoginOrganizador',
    component: LoginOrganizador,
    // Rota para ser acedida apenas por utilizadores não logados
    meta: { requiresGuest: true },
  },
  {
    path: '/login/jogador',
    name: 'LoginJogador',
    component: LoginJogador,
    // Rota para ser acedida apenas por utilizadores não logados
    meta: { requiresGuest: true },
  },

  // Rotas Protegidas do Organizador
  {
    path: '/organizador/dashboard',
    name: 'DashboardOrganizador',
    component: TelaPrincipalOrganizador,
    meta: { requiresAuth: true, tipo: 'organizador' },
  },
  {
    path: '/organizador/criar-torneio',
    name: 'CriarTorneio',
    component: CriarTorneio,
    meta: { requiresAuth: true, tipo: 'organizador' },
  },
  {
    path: '/organizador/gerenciar-torneios',
    name: 'GerenciarTorneios',
    component: GerenciarTorneios,
    meta: { requiresAuth: true, tipo: 'organizador' },
  },
  {
    path: '/organizador/gerenciar-torneios/:id/inscricoes',
    name: 'GerenciarInscricoes',
    component: GerenciarInscricoes,
    meta: { requiresAuth: true, tipo: 'organizador' },
  },
  {
    path: '/organizador/gerenciar-torneios/:id/resultados',
    name: 'GerenciarResultados',
    component: GerenciarResultados,
    meta: { requiresAuth: true, tipo: 'organizador' },
  },

  // Rota Protegida do Jogador
  {
    path: '/jogador/dashboard',
    name: 'DashboardJogador',
    component: DashboardJogador,
    meta: { requiresAuth: true, tipo: 'jogador' },
  },

  // Rotas Públicas
  { path: '/torneios', name: 'ListaPublicaTorneios', component: ListaPublicaTorneios },
  { path: '/torneio/:id', name: 'DetalhesTorneio', component: DetalhesTorneio },
  { path: '/torneio/:id/inscrever', name: 'InscricaoTorneio', component: InscricaoTorneio },
  { path: '/inscricao-confirmada', name: 'InscricaoConfirmada', component: InscricaoConfirmada },
  { path: '/torneio/:id/chaves', name: 'ChaveamentoTorneio', component: ChaveamentoTorneio },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guarda de Navegação (Navigation Guard)
router.beforeEach((to, from, next) => {
  const { estaLogado, tipoDeUtilizador } = useAuth()

  const requiresAuth = to.meta.requiresAuth
  const tipoRequerido = to.meta.tipo as string | undefined
  const requiresGuest = to.meta.requiresGuest

  // 1. Se a rota é para convidados (página de login) e o utilizador JÁ está logado
  if (requiresGuest && estaLogado.value) {
    const redirectTo = tipoDeUtilizador.value === 'organizador' ? { name: 'DashboardOrganizador' } : { name: 'DashboardJogador' }
    next(redirectTo)
  }
  // 2. Se a rota requer autenticação e o utilizador NÃO está logado
  else if (requiresAuth && !estaLogado.value) {
    const redirectTo = tipoRequerido === 'organizador' ? { name: 'LoginOrganizador' } : { name: 'LoginJogador' }
    next(redirectTo)
  }
  // 3. Se a rota requer um 'tipo' de utilizador e o 'tipo' do utilizador logado é diferente
  else if (requiresAuth && tipoDeUtilizador.value !== tipoRequerido) {
    // Redireciona para a página inicial para evitar acesso indevido
    next({ name: 'PaginaInicial' })
  }
  // 4. Se nenhuma das condições acima for atendida, permite a navegação
  else {
    next()
  }
})

export default router
