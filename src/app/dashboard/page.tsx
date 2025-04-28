"use client"

import GovBrLoading from "@/components/ui/GovBrLoading"
import { DashboardCard } from "@/components/ui/dashboard-card"
import MetadadosDashboardCard from "@/container/cards/MetadadosDashboardCard"
import ProcessDashboardCard from "@/container/cards/ProcessDashboardCard"
import withPermissao from "@/hoc/withPermissao"
import usePermissoes from "@/hooks/usePermissoes"
import { Assessment, Business, Person } from "@mui/icons-material"
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
              <DashboardCard.Title variant="h6">Estatísticas</DashboardCard.Title>
            </Stack>
            <DashboardCard.Description variant="body2">
              Veja relatórios e métricas do processamento de dados.
            </DashboardCard.Description>
          </DashboardCard>
        </Grid>
      )}

      {/* ===== Metadados ===== */}
      {permissoes["Exibir_Metadados"] && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} component="div">
          <MetadadosDashboardCard />
        </Grid>
      )}

      {/* ===== Responsáveis ===== */}
      {permissoes["Exibir_Responsavel"] && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} component="div">
          <DashboardCard
            hasAction
            action={() => router.push("/dashboard/responsaveis")}
            sx={{ bgcolor: "background.paper" }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Person sx={{ fontSize: 40, color: "success.main" }} />
              <DashboardCard.Title variant="h6">Responsáveis</DashboardCard.Title>
            </Stack>
            <DashboardCard.Description variant="body2">
              Controle de usuários responsáveis por processos.
            </DashboardCard.Description>
          </DashboardCard>
        </Grid>
      )}
      {/* ===== Requeridos ===== */}
      {permissoes["Exibir_Responsavel"] && (
        <Grid size={{ xs: 12, md: 4 }} component="div">
          <DashboardCard
            hasAction
            action={() => router.push("/dashboard/requeridos")}
            sx={{ bgcolor: "background.paper" }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Business sx={{ fontSize: 40, color: "secondary.main" }} />
              <DashboardCard.Title variant="h6">Requeridos</DashboardCard.Title>
            </Stack>
            <DashboardCard.Description variant="body2">
              Acesse e gerencie os requeridos cadastrados.
            </DashboardCard.Description>
          </DashboardCard>
        </Grid>
      )}
    </Grid>
  )
}

// Protege toda a página: só usuários com Exibir_Processo podem ver o dashboard.
// Ajuste acao/recurso conforme seu enum de permissões.
export default withPermissao(DashboardBacklog, "Exibir", "Processo")
