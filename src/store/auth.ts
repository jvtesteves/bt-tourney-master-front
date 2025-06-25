import { ref, watch, computed } from 'vue'

// O estado do utilizador logado será guardado aqui. Ex: { tipo: 'organizador' }
const utilizadorLogado = ref(JSON.parse(localStorage.getItem('bt_tourney_utilizador')) || null)

// Salva o estado do utilizador no localStorage sempre que ele mudar
watch(
  utilizadorLogado,
  (novoValor) => {
    localStorage.setItem('bt_tourney_utilizador', JSON.stringify(novoValor))
  },
  { deep: true },
)

// Funções para gerir a autenticação
function login(tipo) {
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
