import { ref, watch } from 'vue'
import type { Inscricao } from './types' // Importa diretamente de types.ts

function getInscricoesIniciais(): Inscricao[] {
  const inscricoesGuardadas = localStorage.getItem('bt_tourney_inscricoes')
  if (inscricoesGuardadas) {
    try {
      return JSON.parse(inscricoesGuardadas) as Inscricao[]
    } catch (_e) {
      localStorage.removeItem('bt_tourney_inscricoes')
      return []
    }
  }
  return []
}

const inscricoes = ref<Inscricao[]>(getInscricoesIniciais())

watch(
  inscricoes,
  (novasInscricoes) => {
    localStorage.setItem('bt_tourney_inscricoes', JSON.stringify(novasInscricoes))
  },
  { deep: true },
)

export { inscricoes }
