"use client"

import Link from "next/link"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

export default function HomePage() {
  return (
    <>
      <Container
        component="main"
        sx={{
          py: 8,
          textAlign: "center",
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Sistema de Processamento Backlog DIM
        </Typography>

        <Typography variant="h5" sx={{ mb: 4 }}>
          Plataforma de gestão de processos administrativos
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" size="large" component={Link} href="/auth/login">
            Acessar Sistema
          </Button>

          <Button variant="outlined" size="large" component={Link} href="/publico">
            Dashboard Público
          </Button>

          <Button variant="outlined" size="large" component={Link} href="/sobre">
            Saiba Mais
          </Button>
        </Box>
      </Container>
    </>
  )
}
