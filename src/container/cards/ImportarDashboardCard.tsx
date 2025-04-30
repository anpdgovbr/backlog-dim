"use client"

import { DashboardCard } from "@/components/ui/dashboard-card"
import { UploadFile } from "@mui/icons-material"
import { Stack } from "@mui/material"
import { useRouter } from "next/navigation"

function ImportarDashboardCard() {
  const router = useRouter()

  return (
    <DashboardCard
      hasAction
      action={() => router.push("/dashboard/importar")}
      sx={{ bgcolor: "background.paper" }}
    >
      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        <UploadFile sx={{ fontSize: 40, color: "accent.dark" }} />
        <DashboardCard.Title variant="h6">Importar processos</DashboardCard.Title>
      </Stack>

      <DashboardCard.Description variant="body2">
        Importe arquivos CSV oriundos do Sistema de Denúncia e Peticionamento . Essa
        funcionalidade permite a carga estruturada de múltiplos processos em lote.
      </DashboardCard.Description>
    </DashboardCard>
  )
}

export default ImportarDashboardCard
