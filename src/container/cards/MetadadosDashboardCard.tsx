import { DashboardCard } from "@/components/ui/dashboard-card"
import { TableChart } from "@mui/icons-material"
import { Stack } from "@mui/material"
import { useRouter } from "next/navigation"

function MetadadosDashboardCard() {
  const router = useRouter()
  return (
    <DashboardCard
      hasAction
      action={() => router.push("/dashboard/metadados")}
      sx={{ bgcolor: "background.paper" }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <TableChart sx={{ fontSize: 40, color: "info.main" }} />
        <DashboardCard.Title variant="h6">Metadados</DashboardCard.Title>
      </Stack>
      <DashboardCard.Description variant="body2">
        Gerencie tipos de encaminhamento, evidências e outras categorias auxiliares.
      </DashboardCard.Description>
    </DashboardCard>
  )
}

export default MetadadosDashboardCard
