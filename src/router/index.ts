import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../store/auth'
import PaginaInicial from '../views/PaginaInicial.vue'
import LoginOrganizador from '../views/LoginOrganizador.vue'
import LoginJogador from '../views/LoginJogador.vue'
import CadastroUsuario from '../views/CadastroUsuario.vue'
import ConfirmacaoView from '../views/ConfirmacaoCadastro.vue'
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
  { path: '/login/organizador', name: 'LoginOrganizador', component: LoginOrganizador, meta: { requiresGuest: true } },
  { path: '/login/jogador', name: 'LoginJogador', component: LoginJogador, meta: { requiresGuest: true } },

  // Adiciona as rotas para o fluxo de cadastro
  { path: '/cadastro', name: 'CadastroUsuario', component: CadastroUsuario, meta: { requiresGuest: true } },
  { path: '/confirmacao', name: 'ConfirmacaoCadastro', component: ConfirmacaoView, meta: { requiresGuest: true } },

  // Rotas Protegidas do Organizador
  { path: '/organizador/dashboard', name: 'DashboardOrganizador', component: TelaPrincipalOrganizador, meta: { requiresAuth: true, tipo: 'organizador' } },
  { path: '/organizador/criar-torneio', name: 'CriarTorneio', component: CriarTorneio, meta: { requiresAuth: true, tipo: 'organizador' } },
  { path: '/organizador/gerenciar-torneios', name: 'GerenciarTorneios', component: GerenciarTorneios, meta: { requiresAuth: true, tipo: 'organizador' } },
  { path: '/organizador/gerenciar-torneios/:id/inscricoes', name: 'GerenciarInscricoes', component: GerenciarInscricoes, meta: { requiresAuth: true, tipo: 'organizador' } },
  { path: '/organizador/gerenciar-torneios/:id/resultados', name: 'GerenciarResultados', component: GerenciarResultados, meta: { requiresAuth: true, tipo: 'organizador' } },

  // Rota Protegida do Jogador
  { path: '/jogador/dashboard', name: 'DashboardJogador', component: DashboardJogador, meta: { requiresAuth: true, tipo: 'jogador' } },

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

router.beforeEach((to, from, next) => {
  const { estaLogado, tipoDeUtilizador } = useAuth()

  const requiresAuth = to.meta.requiresAuth
  const tipoRequerido = to.meta.tipo as string | undefined
  const requiresGuest = to.meta.requiresGuest

  if (requiresGuest && estaLogado.value) {
    const redirectTo = tipoDeUtilizador.value === 'organizador' ? { name: 'DashboardOrganizador' } : { name: 'DashboardJogador' }
    next(redirectTo)
  }
  else if (requiresAuth && !estaLogado.value) {
    const redirectTo = tipoRequerido === 'organizador' ? { name: 'LoginOrganizador' } : { name: 'LoginJogador' }
    next(redirectTo)
  }
  else if (requiresAuth && tipoDeUtilizador.value !== tipoRequerido) {
    next({ name: 'PaginaInicial' })
  }
  else {
    next()
  }
})

export default router
