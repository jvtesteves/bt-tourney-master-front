import { ref, watch, computed } from 'vue'
import { signOut } from 'aws-amplify/auth'

// --- As suas interfaces existentes permanecem as mesmas ---
interface DadosCognitoUtilizador {
  username: string;
  name?: string;
}
type TipoUtilizador = 'organizador' | 'jogador'
interface Utilizador {
  tipo: TipoUtilizador
  dados: DadosCognitoUtilizador
}

// ATUALIZAÇÃO: Voltamos a usar localStorage e adicionamos uma chave para o contador de separadores
const USER_STORAGE_KEY = 'bt_tourney_user'
const TAB_COUNT_KEY = 'bt_tourney_active_tabs'

// --- Lógica para Contagem de Separadores ---
// Este código é executado uma vez quando a aplicação é carregada.

// Quando um novo separador é aberto, incrementa o contador.
window.addEventListener('load', () => {
  let count = Number(localStorage.getItem(TAB_COUNT_KEY) || '0');
  count++;
  localStorage.setItem(TAB_COUNT_KEY, count.toString());
});

// Quando um separador está prestes a ser fechado, decrementa o contador.
window.addEventListener('beforeunload', () => {
  let count = Number(localStorage.getItem(TAB_COUNT_KEY) || '0');
  if (count > 0) {
    count--;
  }
  localStorage.setItem(TAB_COUNT_KEY, count.toString());
  // Se este era o último separador, apaga a sessão do utilizador.
  if (count === 0) {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
});
// -----------------------------------------


// Função segura para obter o utilizador inicial do localStorage
function getUtilizadorInicial(): Utilizador | null {
  // ATUALIZAÇÃO: Verifica se o contador de separadores é zero. Se for, a sessão é inválida.
  const tabCount = Number(localStorage.getItem(TAB_COUNT_KEY) || '0');
  if (tabCount === 0) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }

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
    // Limpa o estado local
    utilizadorLogado.value = null;
    // ATUALIZAÇÃO: Zera o contador de separadores ao fazer logout explícito
    localStorage.setItem(TAB_COUNT_KEY, '0');
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
