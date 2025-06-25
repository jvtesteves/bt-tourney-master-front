import { ref, watch } from 'vue'

// A estrutura das chaves é um objeto, não uma lista.
const chaves = ref(JSON.parse(localStorage.getItem('bt_tourney_chaves')) || {})

watch(
  chaves,
  (novasChaves) => {
    localStorage.setItem('bt_tourney_chaves', JSON.stringify(novasChaves))
  },
  { deep: true },
)

export { chaves }
