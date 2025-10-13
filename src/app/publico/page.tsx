"use client"

import { useMemo } from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"

import ImportarDashboardCard from "@/app/dashboard/_components/ImportarDashboardCard"
import MetadadosDashboardCard from "@/app/dashboard/_components/MetadadosDashboardCard"
import ProcessDashboardCard from "@/app/dashboard/_components/ProcessDashboardCard"
import RequeridosDashboardCard from "@/app/dashboard/_components/RequeridosDashboardCard"
import ResponsaveisDashboardCard from "@/app/dashboard/_components/ResponsaveisDashboardCard"
import StatsDashboardCard from "@/app/dashboard/_components/StatsDashboardCard"

/**
 * Componente de página pública que renderiza o "Dashboard Público - ANPD".
 *
 * Apresenta:
 * - Cabeçalho com título e descrição.
 * - Indicadores principais e cartões de métricas detalhadas (ProcessDashboardCard, StatsDashboardCard, etc.).
 * - Seção de dados detalhados com responsáveis, requeridos e metadados.
 * - Rodapé informativo sobre o escopo público dos dados.
 *
 * Observações:
 * - Este arquivo é um client component (usa "use client").
 * - Estilos otimizados com useMemo para evitar re-renderizações.
 * - Usa contrastText do theme para cores de texto em backgrounds coloridos.
 *
 * @returns {JSX.Element} Marcação da página pública com caixas, grids e cards.
 */
export default function PublicoPage() {
  const theme = useTheme()

  // Estilos memoizados para evitar recriação em cada render
  const headerStyles = useMemo(
    () => ({
      p: 4,
      mb: 4,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      textAlign: "center" as const,
      borderRadius: 2,
    }),
    [theme.palette.primary.main, theme.palette.primary.contrastText]
  )

  const subtitleStyles = useMemo(
    () => ({
      opacity: 0.95,
      maxWidth: 800,
      mx: "auto",
      color: theme.palette.primary.contrastText,
    }),
    [theme.palette.primary.contrastText]
  )

  const sectionTitleStyles = useMemo(
    () => ({
      mb: 3,
      color: theme.palette.text.primary,
    }),
    [theme.palette.text.primary]
  )

  const footerStyles = useMemo(
    () => ({
      p: 3,
      mt: 4,
      backgroundColor: theme.palette.grey[100],
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      textAlign: "center" as const,
    }),
    [theme.palette.grey, theme.palette.primary.main]
  )

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header da página pública */}
      <Paper elevation={0} sx={headerStyles}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight={theme.typography.fontWeightBold}
          color="inherit"
        >
          Dashboard Público - ANPD
        </Typography>
        <Typography variant="h6" sx={subtitleStyles}>
          Transparência e acompanhamento dos processos administrativos da Divisão de
          Monitoramento
        </Typography>
      </Paper>

      {/* Seção de métricas principais */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          textAlign="center"
          fontWeight={theme.typography.fontWeightMedium}
          sx={sectionTitleStyles}
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
          fontWeight={theme.typography.fontWeightMedium}
          sx={sectionTitleStyles}
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
      <Paper elevation={0} sx={footerStyles}>
        <Typography variant="body1" color="text.secondary">
          <Typography component="strong" fontWeight={theme.typography.fontWeightMedium}>
            Acesso Público:
          </Typography>{" "}
          Esta página apresenta dados agregados e estatísticas gerais dos processos
          administrativos da ANPD, garantindo transparência institucional sem expor
          informações sensíveis.
        </Typography>
      </Paper>
    </Container>
  )
}
