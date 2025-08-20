import { useRouter } from "next/navigation"

import TableChartIcon from "@mui/icons-material/TableChart"

import { BaseDashboardCard } from "@/components/ui/dashboard-card"

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
