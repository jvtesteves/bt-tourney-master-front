import { ref, watch } from 'vue'

// Tenta carregar os torneios do localStorage, ou começa com uma lista vazia.
const torneios = ref(JSON.parse(localStorage.getItem('bt_tourney_torneios')) || [])

// 'watch' observa a variável 'torneios' e, sempre que ela for alterada,
// salva a nova versão no localStorage.
watch(
  torneios,
  (novosTorneios) => {
    localStorage.setItem('bt_tourney_torneios', JSON.stringify(novosTorneios))
  },
  { deep: true },
) // 'deep: true' é necessário para detectar mudanças dentro dos objetos da lista.

// Exporta a variável reativa para que os componentes possam usá-la.
export { torneios }
