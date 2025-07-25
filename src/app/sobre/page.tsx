import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"

export default function SobrePage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sobre o Sistema
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Box mb={4}>
        <Typography variant="body1" paragraph>
          O <strong>Sistema de Fila de Processamento</strong> foi desenvolvido para apoiar
          a Autoridade Nacional de Proteção de Dados (ANPD) no gerenciamento de
          requerimentos relacionados à{" "}
          <strong>Lei Geral de Proteção de Dados Pessoais (LGPD)</strong>.
        </Typography>

        <Typography variant="body1" paragraph>
          A aplicação permite o acompanhamento e tratamento de{" "}
          <strong>denúncias e petições</strong> de titulares, com rastreabilidade,
          controle de status, responsáveis designados e exportação de dados para painéis
          analíticos como o Power BI.
        </Typography>

        <Typography variant="body1" paragraph>
          O sistema segue as diretrizes do{" "}
          <strong>Padrão Digital de Governo (Gov.br)</strong>, utilizando tecnologias como
          <strong> Next.js</strong>, <strong>Supabase</strong> e{" "}
          <strong>Design System do Governo Federal</strong> para proporcionar uma
          experiência consistente e acessível.
        </Typography>
      </Box>
    </Container>
  )
}
