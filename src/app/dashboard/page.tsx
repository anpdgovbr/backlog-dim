"use client"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { CardGrid, DashboardLayout, DashboardSection } from "@/components/layouts"
import ImportarDashboardCard from "@/app/dashboard/_components/ImportarDashboardCard"
import MetadadosDashboardCard from "@/app/dashboard/_components/MetadadosDashboardCard"
import ProcessDashboardCard from "@/app/dashboard/_components/ProcessDashboardCard"
import RequeridosDashboardCard from "@/app/dashboard/_components/RequeridosDashboardCard"
import ResponsaveisDashboardCard from "@/app/dashboard/_components/ResponsaveisDashboardCard"
import StatsDashboardCard from "@/app/dashboard/_components/StatsDashboardCard"
import withPermissao from "@/hoc/withPermissao"
import usePermissoes from "@/hooks/usePermissoes"
import { hasAny, pode } from "@/lib/permissions"

function DashboardBacklog() {
  const { permissoes, loading } = usePermissoes()

  const hasAnyPermission = hasAny(permissoes, [
    ["Exibir", "Processo"],
    ["Exibir", "Relatorios"],
    ["Exibir", "Metadados"],
    ["Exibir", "Responsavel"],
  ])

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
      {(pode(permissoes, "Exibir", "Processo") ||
        pode(permissoes, "Exibir", "Relatorios")) && (
        <DashboardSection
          title="Visão Geral"
          subtitle="Acompanhe métricas e indicadores principais"
        >
          <CardGrid columns={{ xs: 12, lg: 6 }} minCardHeight={380}>
            {pode(permissoes, "Exibir", "Processo") && <ProcessDashboardCard />}
            {pode(permissoes, "Exibir", "Relatorios") && <StatsDashboardCard />}
          </CardGrid>
        </DashboardSection>
      )}

      {/* ===== Seção de Gerenciamento ===== */}
      {(pode(permissoes, "Exibir", "Responsavel") ||
        pode(permissoes, "Exibir", "Metadados")) && (
        <DashboardSection
          title="Gerenciamento"
          subtitle="Administre usuários, categorias e configurações"
        >
          <CardGrid columns={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} minCardHeight="auto">
            {pode(permissoes, "Exibir", "Responsavel") && <ResponsaveisDashboardCard />}
            {pode(permissoes, "Exibir", "Responsavel") && <RequeridosDashboardCard />}
            {pode(permissoes, "Exibir", "Metadados") && <MetadadosDashboardCard />}
            {pode(permissoes, "Exibir", "Metadados") && <ImportarDashboardCard />}
          </CardGrid>
        </DashboardSection>
      )}
    </DashboardLayout>
  )
}

// Protege toda a página: só usuários com Exibir_Processo podem ver o dashboard.
export default withPermissao(DashboardBacklog, "Exibir", "Processo")
