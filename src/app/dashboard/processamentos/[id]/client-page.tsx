'use client'

import { ProcessamentosOutput } from '@/types/Requerimentos'
import { Box, Container, Typography } from '@mui/material'

interface ClientProcessamentoProps {
  data: ProcessamentosOutput
}
export default function ClientProcessamento({
  data
}: ClientProcessamentoProps) {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Detalhes do Processamento</Typography>
        <Typography variant="h6">Responsável: {data.responsavel}</Typography>
        <Typography variant="body1">
          Número do Protocolo: {data.numero_protocolo}
        </Typography>
        <Typography variant="body1">
          Data de Criação: {data.data_criacao}
        </Typography>
        <Typography variant="body1">Status: {data.status}</Typography>
        <Typography variant="body1">
          Tipo de Solicitação: {data.tipo_solicitacao}
        </Typography>
        <Typography variant="body1">
          Denúncia Anônima: {data.denuncia_anonima ? 'Sim' : 'Não'}
        </Typography>
        <Typography variant="body1">
          Solicitante: {data.ticket_solicitante}
        </Typography>
      </Box>
    </Container>
  )
}
