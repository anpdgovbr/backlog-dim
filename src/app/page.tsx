"use client"

import { Box, Button, Container, Typography } from "@mui/material"
import Link from "next/link"

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

          <Button variant="outlined" size="large" component={Link} href="/sobre">
            Saiba Mais
          </Button>
        </Box>
      </Container>
    </>
  )
}
