"use client"

import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import GovBrLoading from "@/components/ui/GovBrLoading"

interface DashboardLayoutProps {
  readonly children: React.ReactNode
  readonly title?: string
  readonly subtitle?: string
  readonly loading?: boolean
  readonly loadingMessage?: string
  readonly actions?: React.ReactNode
  readonly sidebar?: React.ReactNode
  readonly hasSidebar?: boolean
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  loading = false,
  loadingMessage = "Carregando...",
  actions,
  sidebar,
  hasSidebar = false,
}: DashboardLayoutProps) {
  if (loading) {
    return <GovBrLoading message={loadingMessage} />
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
      }}
    >
      {/* Header do conteúdo da página (não do dashboard) */}
      {(title || actions) && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              {title && (
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom={!!subtitle}
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body1" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {actions && <Box>{actions}</Box>}
          </Stack>
        </Paper>
      )}

      {/* Conteúdo com ou sem sidebar */}
      {hasSidebar && sidebar ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "background.paper",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                borderRadius: 2,
                position: "sticky",
                top: 24,
              }}
            >
              {sidebar}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Box>{children}</Box>
          </Grid>
        </Grid>
      ) : (
        <Box>{children}</Box>
      )}
    </Box>
  )
}
