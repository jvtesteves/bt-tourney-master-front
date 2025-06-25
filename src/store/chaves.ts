import { ref, watch } from 'vue'

// 1. Definir os tipos para a nossa estrutura de dados
type Dupla = [string, string]

// Adicionada a palavra-chave 'export' para que a interface possa ser importada noutros ficheiros
export interface Jogo {
  id: number
  dupla1: Dupla
  dupla2: Dupla | null
  resultado: {
    dupla1: number | null
    dupla2: number | null
  }
}

// As chaves são um objeto onde a chave é o ID do torneio (um número)
// e o valor é a lista de jogos.
type Chaves = Record<number, Jogo[]>

// 2. Função segura para obter as chaves iniciais do localStorage
function getChavesIniciais(): Chaves {
  const chavesGuardadas = localStorage.getItem('bt_tourney_chaves')
  if (chavesGuardadas) {
    try {
      return JSON.parse(chavesGuardadas) as Chaves
    } catch (_e) {
      localStorage.removeItem('bt_tourney_chaves')
      return {} // Retorna um objeto vazio em caso de erro
    }
  }
  return {} // Retorna um objeto vazio se não houver nada guardado
}

// 3. Tipificar a nossa 'ref' para aceitar o tipo 'Chaves'
const chaves = ref<Chaves>(getChavesIniciais())

// Salva as chaves no localStorage sempre que elas mudarem
watch(
  chaves,
  (novasChaves) => {
    localStorage.setItem('bt_tourney_chaves', JSON.stringify(novasChaves))
  },
  { deep: true },
)

export { chaves }
