// Este ficheiro define as estruturas de dados para toda a aplicação.

export type Dupla = [string, string]

export interface Torneio {
  id: number
  nome: string
  local: string
  dataInicio: string
  dataFim: string
}

export interface Inscricao {
  id: number
  torneioId: number
  nomeTorneio: string
  dupla: Dupla
}

export interface Jogo {
  id: number
  dupla1: Dupla
  dupla2: Dupla | null
  resultado: {
    dupla1: number | null
    dupla2: number | null
  }
}
