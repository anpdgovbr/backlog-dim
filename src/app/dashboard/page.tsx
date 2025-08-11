"use client"

import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

import GovBrLoading from "@/components/ui/GovBrLoading"
import ImportarDashboardCard from "@/components/ui/dashboard-card/ImportarDashboardCard"
import MetadadosDashboardCard from "@/components/ui/dashboard-card/MetadadosDashboardCard"
import ProcessDashboardCard from "@/components/ui/dashboard-card/ProcessDashboardCard"
import RequeridosDashboardCard from "@/components/ui/dashboard-card/RequeridosDashboardCard"
import ResponsaveisDashboardCard from "@/components/ui/dashboard-card/ResponsaveisDashboardCard"
import StatsDashboardCard from "@/components/ui/dashboard-card/StatsDashboardCard"
import withPermissao from "@/hoc/withPermissao"
import usePermissoes from "@/hooks/usePermissoes"

function DashboardBacklog() {
  const { permissoes, loading } = usePermissoes()

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <GovBrLoading />
      </Box>
    )
  }

  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {/* ===== Processos (principal) ===== */}
      {permissoes["Exibir_Processo"] && (
        <Grid size={{ xs: 12, md: 6 }} component="div">
          <ProcessDashboardCard />
        </Grid>
      )}

      {/* ===== Estatísticas ===== */}
      {permissoes["Exibir_Relatorios"] && (
        <Grid size={{ xs: 12, md: 6 }} component="div">
          <StatsDashboardCard />
        </Grid>
      )}

      {/* ===== Metadados ===== 
      ajustar futuramente
      */}
      {permissoes["Exibir_Metadados"] && (
        <Grid container spacing={2} columns={12} size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid size={{ xs: 12 }} component="div">
            <MetadadosDashboardCard />
          </Grid>
          <Grid size={{ xs: 12 }} component="div">
            <ImportarDashboardCard />
          </Grid>
        </Grid>
      )}

      {/* ===== Responsáveis ===== */}
      {permissoes["Exibir_Responsavel"] && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} component="div">
          <ResponsaveisDashboardCard />
        </Grid>
      )}
      {/* ===== Requeridos ===== */}
      {permissoes["Exibir_Responsavel"] && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} component="div" minWidth={0}>
          <RequeridosDashboardCard />
        </Grid>
      )}
    </Grid>
  )
}

// Protege toda a página: só usuários com Exibir_Processo podem ver o dashboard.
// Ajuste acao/recurso conforme seu enum de permissões.
export default withPermissao(DashboardBacklog, "Exibir", "Processo")
