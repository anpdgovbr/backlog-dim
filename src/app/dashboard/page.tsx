"use client"

import GovBrLoading from "@/components/ui/GovBrLoading"
import { DashboardCard } from "@/components/ui/dashboard-card"
import ImportarDashboardCard from "@/container/cards/ImportarDashboardCard"
import MetadadosDashboardCard from "@/container/cards/MetadadosDashboardCard"
import ProcessDashboardCard from "@/container/cards/ProcessDashboardCard"
import RequeridosDashboardCard from "@/container/cards/RequeridosDashboardCard"
import ResponsaveisDashboardCard from "@/container/cards/ResponsaveisDashboardCard"
import withPermissao from "@/hoc/withPermissao"
import usePermissoes from "@/hooks/usePermissoes"
import { Assessment } from "@mui/icons-material"
import { Box, Grid, Stack } from "@mui/material"
import { useRouter } from "next/navigation"

function DashboardBacklog() {
  const router = useRouter()
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
        <Grid size={{ xs: 12, md: 8 }} component="div">
          <ProcessDashboardCard />
        </Grid>
      )}

      {/* ===== Estatísticas ===== */}
      {permissoes["Exibir_Relatorios"] && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} component="div">
          <DashboardCard
            hasAction
            action={() => router.push("/dashboard/estatisticas")}
            sx={{ bgcolor: "background.paper" }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Assessment sx={{ fontSize: 40, color: "warning.main" }} />
              <DashboardCard.Title>Estatísticas</DashboardCard.Title>
            </Stack>
            <DashboardCard.Description variant="body2">
              Veja relatórios e métricas do processamento de dados.
            </DashboardCard.Description>
          </DashboardCard>
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
        <Grid size={{ xs: 12, md: 4 }} component="div" minWidth={0}>
          <RequeridosDashboardCard />
        </Grid>
      )}
    </Grid>
  )
}

// Protege toda a página: só usuários com Exibir_Processo podem ver o dashboard.
// Ajuste acao/recurso conforme seu enum de permissões.
export default withPermissao(DashboardBacklog, "Exibir", "Processo")
