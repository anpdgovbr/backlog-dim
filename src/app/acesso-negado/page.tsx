"use client"

import Link from "next/link"

import Box from "@mui/material/Box"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"

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
        <GovBRButton
          variant="contained"
          color="primary"
          component={Link}
          href="/dashboard"
        >
          Voltar ao Início
        </GovBRButton>

        <GovBRButton
          variant="outlined"
          color="primary"
          component={Link}
          href="/auth/logout"
        >
          Trocar Usuário
        </GovBRButton>
      </Box>
    </Container>
  )
}
