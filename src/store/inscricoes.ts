import { ref, watch } from 'vue'

const inscricoes = ref(JSON.parse(localStorage.getItem('bt_tourney_inscricoes')) || [])

watch(
  inscricoes,
  (novasInscricoes) => {
    localStorage.setItem('bt_tourney_inscricoes', JSON.stringify(novasInscricoes))
  },
  { deep: true },
)

export { inscricoes }
