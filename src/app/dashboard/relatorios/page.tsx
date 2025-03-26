"use client"

import withPermissao from "@/hoc/withPermissao"
import { Box, Container, Typography } from "@mui/material"

function RelatoriosPageContent() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          bgcolor: "background.default",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,

          minHeight: "60vh",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Área de Relatórios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Espaço reservado para gráficos, estatísticas e indicadores do sistema.
        </Typography>
      </Box>
    </Container>
  )
}
const RelatoriosPage = withPermissao(RelatoriosPageContent, "Exibir", "Relatorios", {
  redirecionar: false,
})
export default RelatoriosPage
