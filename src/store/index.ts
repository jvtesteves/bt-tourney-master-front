import { ref, watch } from 'vue'

// 1. Definir a interface para a nossa estrutura de dados de Torneio
export interface Torneio {
  id: number
  nome: string
  local: string
  dataInicio: string
  dataFim: string
}

// 2. Função segura para obter os torneios iniciais do localStorage
function getTorneiosIniciais(): Torneio[] {
  const torneiosGuardados = localStorage.getItem('bt_tourney_torneios')
  if (torneiosGuardados) {
    try {
      // Garantimos que os dados guardados correspondem à nossa interface
      return JSON.parse(torneiosGuardados) as Torneio[]
    } catch (_e) {
      // Se houver um erro, removemos os dados inválidos
      localStorage.removeItem('bt_tourney_torneios')
      return []
    }
  }
  // Retorna uma lista vazia se não houver nada guardado
  return []
}

// 3. Tipificar a nossa 'ref' para aceitar uma lista de 'Torneio'
const torneios = ref<Torneio[]>(getTorneiosIniciais())

// 'watch' observa a variável 'torneios' e, sempre que ela for alterada,
// salva a nova versão no localStorage.
watch(
  torneios,
  (novosTorneios) => {
    localStorage.setItem('bt_tourney_torneios', JSON.stringify(novosTorneios))
  },
  { deep: true }, // 'deep: true' é necessário para detectar mudanças dentro dos objetos da lista.
)

// Exporta a variável reativa para que os componentes possam usá-la.
export { torneios }
