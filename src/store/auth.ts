import { ref, watch, computed } from 'vue'

// 1. Definir os tipos para o nosso utilizador
// Isto garante que 'tipo' só pode ser 'organizador' ou 'jogador'.
type TipoUtilizador = 'organizador' | 'jogador'
interface Utilizador {
  tipo: TipoUtilizador
}

// 2. Função segura para obter o utilizador inicial do localStorage
function getUtilizadorInicial(): Utilizador | null {
  const utilizadorGuardado = localStorage.getItem('bt_tourney_utilizador')
  if (utilizadorGuardado) {
    try {
      return JSON.parse(utilizadorGuardado) as Utilizador
    } catch (_e) {
      // Corrigido: 'e' renomeado para '_e' para indicar que não é utilizado
      // Se houver um erro ao processar o JSON, remove o item inválido
      localStorage.removeItem('bt_tourney_utilizador')
      return null
    }
  }
  return null
}

// 3. Tipificar a nossa 'ref' para aceitar um 'Utilizador' ou 'null'
const utilizadorLogado = ref<Utilizador | null>(getUtilizadorInicial())

// Salva o estado do utilizador no localStorage sempre que ele mudar
watch(
  utilizadorLogado,
  (novoValor) => {
    localStorage.setItem('bt_tourney_utilizador', JSON.stringify(novoValor))
  },
  { deep: true },
)

// Funções para gerir a autenticação
// 4. Tipificar o parâmetro da função 'login'
function login(tipo: TipoUtilizador) {
  utilizadorLogado.value = { tipo: tipo }
}

function logout() {
  utilizadorLogado.value = null
}

// Propriedades computadas para facilitar a verificação nos componentes
const estaLogado = computed(() => !!utilizadorLogado.value)
const tipoDeUtilizador = computed(() => utilizadorLogado.value?.tipo)

export function useAuth() {
  return { utilizadorLogado, login, logout, estaLogado, tipoDeUtilizador }
}
