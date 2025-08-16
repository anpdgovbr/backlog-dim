"use client"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

import ImportarDashboardCard from "@/app/dashboard/ImportarDashboardCard"
import MetadadosDashboardCard from "@/app/dashboard/MetadadosDashboardCard"
import ProcessDashboardCard from "@/app/dashboard/ProcessDashboardCard"
import RequeridosDashboardCard from "@/app/dashboard/RequeridosDashboardCard"
import ResponsaveisDashboardCard from "@/app/dashboard/ResponsaveisDashboardCard"
import StatsDashboardCard from "@/app/dashboard/StatsDashboardCard"

export default function PublicoPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header da página pública */}
      <Paper
        elevation={0}
        sx={(theme) => ({
          p: 4,
          mb: 4,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textAlign: "center",
          borderRadius: 2,
        })}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Dashboard Público - ANPD
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: "auto" }}>
          Transparência e acompanhamento dos processos administrativos da Diretoria de
          Investigação e Monitoramento
        </Typography>
      </Paper>

      {/* Seção de métricas principais */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          textAlign="center"
          fontWeight={600}
          sx={{ mb: 3 }}
        >
          Indicadores Principais
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ProcessDashboardCard />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatsDashboardCard />
          </Grid>
        </Grid>
      </Box>

      {/* Seção de dados detalhados */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          textAlign="center"
          fontWeight={600}
          sx={{ mb: 3 }}
        >
          Dados Detalhados
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <ResponsaveisDashboardCard />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <RequeridosDashboardCard />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Grid container spacing={2} sx={{ height: "100%" }}>
              <Grid size={{ xs: 12 }}>
                <MetadadosDashboardCard />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <ImportarDashboardCard />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Footer informativo */}
      <Paper
        elevation={0}
        sx={(theme) => ({
          p: 3,
          mt: 4,
          backgroundColor: theme.palette.grey[50],
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          textAlign: "center",
        })}
      >
        <Typography variant="body1" color="text.secondary">
          <strong>Acesso Público:</strong> Esta página apresenta dados agregados e
          estatísticas gerais dos processos administrativos da ANPD, garantindo
          transparência institucional sem expor informações sensíveis.
        </Typography>
      </Paper>
    </Container>
  )
}
