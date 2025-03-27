"use client"

import { Box, Container, Typography } from "@mui/material"

export default function AdminHomePage() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
        }}
      >
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
            Área de monitoramento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Espaço reservado para gráficos, estatísticas e indicadores do sistema.
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}
