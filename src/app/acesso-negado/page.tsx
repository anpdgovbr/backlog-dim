"use client"

import { Box, Button, Container, Divider, Typography } from "@mui/material"
import Link from "next/link"

export default function AcessoNegadoPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: "center", minHeight: "70vh" }}>
      <Typography variant="h3" component="h1" gutterBottom color="error">
        Acesso Negado
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>
        Você não tem permissão para acessar esta página.
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Caso acredite que isso seja um erro, entre em contato com o administrador do
        sistema ou verifique suas credenciais de acesso.
      </Typography>

      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" color="primary" component={Link} href="/dashboard">
          Voltar ao Início
        </Button>

        <Button variant="outlined" color="primary" component={Link} href="/auth/logout">
          Trocar Usuário
        </Button>
      </Box>
    </Container>
  )
}
