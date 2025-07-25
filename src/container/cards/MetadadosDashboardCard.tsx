import { useRouter } from "next/navigation"

import TableChart from "@mui/icons-material/TableChart"
import Stack from "@mui/material/Stack"

import { DashboardCard } from "@/components/ui/dashboard-card"

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
        <DashboardCard.Title>Metadados</DashboardCard.Title>
      </Stack>
      <DashboardCard.Description variant="body2">
        Gerencie tipos de encaminhamento, evidências e outras categorias auxiliares.
      </DashboardCard.Description>
    </DashboardCard>
  )
}

export default MetadadosDashboardCard
