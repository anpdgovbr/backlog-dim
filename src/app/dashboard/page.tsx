"use client"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { CardGrid, DashboardLayout, DashboardSection } from "@/components/layouts"
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

  const hasAnyPermission =
    permissoes["Exibir_Processo"] ||
    permissoes["Exibir_Relatorios"] ||
    permissoes["Exibir_Metadados"] ||
    permissoes["Exibir_Responsavel"]

  if (!hasAnyPermission) {
    return (
      <DashboardLayout
        title="Acesso Restrito"
        subtitle="Você não possui permissões suficientes para visualizar este conteúdo"
      >
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="body1" color="text.secondary">
            Entre em contato com o administrador do sistema para solicitar acesso.
          </Typography>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Dashboard Administrativo"
      subtitle="Painel de controle e gestão dos processos da DIM/ANPD"
      loading={loading}
      loadingMessage="Carregando dashboard..."
    >
      {/* ===== Seção Principal ===== */}
      {(permissoes["Exibir_Processo"] || permissoes["Exibir_Relatorios"]) && (
        <DashboardSection
          title="Visão Geral"
          subtitle="Acompanhe métricas e indicadores principais"
        >
          <CardGrid columns={{ xs: 12, md: 6 }} minCardHeight={350}>
            {permissoes["Exibir_Processo"] && <ProcessDashboardCard />}
            {permissoes["Exibir_Relatorios"] && <StatsDashboardCard />}
          </CardGrid>
        </DashboardSection>
      )}

      {/* ===== Seção de Gerenciamento ===== */}
      {(permissoes["Exibir_Responsavel"] || permissoes["Exibir_Metadados"]) && (
        <DashboardSection
          title="Gerenciamento"
          subtitle="Administre usuários, categorias e configurações"
        >
          <CardGrid columns={{ xs: 12, sm: 6, lg: 4 }} minCardHeight={280}>
            {permissoes["Exibir_Responsavel"] && (
              <>
                <ResponsaveisDashboardCard />
                <RequeridosDashboardCard />
              </>
            )}
            {permissoes["Exibir_Metadados"] && (
              <>
                <MetadadosDashboardCard />
                <ImportarDashboardCard />
              </>
            )}
          </CardGrid>
        </DashboardSection>
      )}
    </DashboardLayout>
  )
}

// Protege toda a página: só usuários com Exibir_Processo podem ver o dashboard.
export default withPermissao(DashboardBacklog, "Exibir", "Processo")
