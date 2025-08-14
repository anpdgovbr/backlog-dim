"use client"

import Link from "next/link"

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"
import DashboardIcon from "@mui/icons-material/Dashboard"
import InfoIcon from "@mui/icons-material/Info"
import LoginIcon from "@mui/icons-material/Login"
import SecurityIcon from "@mui/icons-material/Security"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"
import { GovBRButton } from "@anpdgovbr/shared-ui"

export default function HomePage() {
  const theme = useTheme()

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: { xs: 6, md: 8 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          borderRadius: 3,
          mb: 6,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "primary.main",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Backlog DIM
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 4,
            color: "text.secondary",
            maxWidth: "800px",
            mx: "auto",
            fontWeight: 400,
          }}
        >
          Sistema de Gestão de Processos Administrativos da Diretoria de Investigação e
          Monitoramento
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            component={Link}
            href="/auth/login"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
          >
            Acessar Sistema
          </Button>

          <GovBRButton
            variant="outlined"
            size="large"
            startIcon={<DashboardIcon />}
            component={Link}
            href="/publico"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
          >
            Dashboard Público
          </GovBRButton>
        </Box>
      </Box>

      {/* Features Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%", textAlign: "center" }}>
            <CardContent sx={{ p: 4 }}>
              <AssignmentTurnedInIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Gestão de Processos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Controle e acompanhamento completo dos processos administrativos da DIM na
                ANPD.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%", textAlign: "center" }}>
            <CardContent sx={{ p: 4 }}>
              <SecurityIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Seguro e Confiável
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Autenticação institucional via Azure AD e controle rigoroso de permissões
                de acesso.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%", textAlign: "center" }}>
            <CardContent sx={{ p: 4 }}>
              <VerifiedUserIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Transparência
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dashboard público com estatísticas e informações de transparência sobre os
                processos.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Information Section */}
      <Paper
        elevation={1}
        sx={{
          p: 4,
          mb: 6,
          backgroundColor: "grey.50",
          borderLeft: `4px solid ${theme.palette.primary.main}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <InfoIcon sx={{ color: "primary.main", mr: 2 }} />
          <Typography variant="h6" fontWeight={600}>
            Acesso Restrito
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Este sistema é destinado exclusivamente a servidores e colaboradores autorizados
          da ANPD. O acesso é realizado através de login institucional com credenciais do
          Azure Active Directory.
        </Typography>
      </Paper>

      {/* Actions Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Precisa de Ajuda?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Para mais informações sobre o sistema ou suporte técnico.
        </Typography>
        <Button
          variant="outlined"
          size="large"
          startIcon={<InfoIcon />}
          component={Link}
          href="/sobre"
        >
          Saiba Mais
        </Button>
      </Box>
    </Container>
  )
}
