import { supabase } from '@/lib/supabase'
import { Box, Container, Typography } from '@mui/material'

export default async function DetalhesProcessamento({
  params
}: {
  params: { id: string }
}) {
  const { data, error } = await supabase
    .from('processamentos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h4">Erro ao carregar os dados</Typography>
      </Container>
    )
  }

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
