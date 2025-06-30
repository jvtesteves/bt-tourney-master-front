import { ref, watch, computed } from 'vue'
import { signOut } from 'aws-amplify/auth'

interface DadosCognitoUtilizador {
  username: string;
  name?: string;
}
type TipoUtilizador = 'organizador' | 'jogador'
interface Utilizador {
  tipo: TipoUtilizador
  dados: DadosCognitoUtilizador
}

function getUtilizadorInicial(): Utilizador | null {
  const utilizadorGuardado = localStorage.getItem('bt_tourney_utilizador')
  if (utilizadorGuardado) {
    try {
      return JSON.parse(utilizadorGuardado) as Utilizador
    } catch (_e) {
      localStorage.removeItem('bt_tourney_utilizador')
      return null
    }
  }
  return null
}

const utilizadorLogado = ref<Utilizador | null>(getUtilizadorInicial())

watch(
  utilizadorLogado,
  (novoValor) => {
    if (novoValor) {
      localStorage.setItem('bt_tourney_utilizador', JSON.stringify(novoValor))
    } else {
      localStorage.removeItem('bt_tourney_utilizador')
    }
  },
  { deep: true },
)

function login(tipo: TipoUtilizador, dadosUtilizador: DadosCognitoUtilizador) {
  utilizadorLogado.value = {
    tipo: tipo,
    dados: dadosUtilizador
  }
}

// Função logout 'async' e chama o signOut da Amplify
async function logout() {
  try {
    // Termina a sessão no Cognito, invalidando os tokens.
    await signOut();
    // Limpa o estado local, fazendo a UI reagir.
    utilizadorLogado.value = null;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    // Mesmo que haja um erro na AWS, força a limpeza local
    utilizadorLogado.value = null;
  }
}

const estaLogado = computed(() => !!utilizadorLogado.value)
const tipoDeUtilizador = computed(() => utilizadorLogado.value?.tipo)
const dadosDoUtilizador = computed(() => utilizadorLogado.value?.dados)

export function useAuth() {
  return {
    utilizadorLogado,
    login,
    logout,
    estaLogado,
    tipoDeUtilizador,
    dadosDoUtilizador
  }
}
