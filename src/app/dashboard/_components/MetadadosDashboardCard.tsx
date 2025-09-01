import { useRouter } from "next/navigation"

import TableChartIcon from "@mui/icons-material/TableChart"

import { BaseDashboardCard } from "@/components/ui/dashboard-card"

/**
 * Componente de card do dashboard para a seção "Metadados".
 *
 * Este componente renderiza um card resumido que permite ao usuário navegar
 * para a página de administração de metadados do sistema.
 *
 * Comportamento:
 * - Exibe ícone, título, subtítulo e descrição.
 * - Ao executar a ação (click), navega para a rota "/dashboard/metadados".
 *
 * Uso:
 * <MetadadosDashboardCard />
 *
 * @returns JSX.Element - Card pronto para ser exibido no dashboard.
 */
function MetadadosDashboardCard() {
  const router = useRouter()
  return (
    <BaseDashboardCard
      icon={<TableChartIcon />}
      title="Metadados"
      subtitle="Configurações do Sistema"
      description="Gerencie tipos de encaminhamento, evidências e outras categorias auxiliares."
      action={() => router.push("/dashboard/metadados")}
      color="info"
    />
  )
}

export default MetadadosDashboardCard
