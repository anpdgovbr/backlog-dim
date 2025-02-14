export interface ProcessamentosInput {
  responsavel: string
  numero_protocolo: number
  data_criacao: string // Mantém como string para facilitar manipulação no formulário
  status: string // Padrão: "Pendente"
  tipo_solicitacao: string
  denuncia_anonima: boolean
  ticket_solicitante: string
}

export interface ProcessamentosOutput extends ProcessamentosInput {
  id: number // O ID gerado pelo Supabase (Serial)
  created_at: string // Data de criação no banco
}
