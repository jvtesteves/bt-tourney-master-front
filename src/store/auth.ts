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

const USER_STORAGE_KEY = 'bt_tourney_user_session'

function getUtilizadorInicial(): Utilizador | null {
  const utilizadorGuardado = localStorage.getItem(USER_STORAGE_KEY)
  if (utilizadorGuardado) {
    try {
      return JSON.parse(utilizadorGuardado) as Utilizador
    } catch (_e) {
      localStorage.removeItem(USER_STORAGE_KEY)
      return null
    }
  }
  return null
}

const utilizadorLogado = ref<Utilizador | null>(getUtilizadorInicial())

// Salva o estado do utilizador no localStorage sempre que ele mudar
watch(
  utilizadorLogado,
  (novoValor) => {
    if (novoValor) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(novoValor))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
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

async function logout() {
  try {
    await signOut();
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  } finally {
    // Limpa o estado local e o localStorage
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
