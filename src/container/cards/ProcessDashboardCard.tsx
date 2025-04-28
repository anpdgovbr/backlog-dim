import { DashboardCard } from "@/components/ui/dashboard-card"
import { EngineeringOutlined } from "@mui/icons-material"
import { Box, Button, Stack } from "@mui/material"
import { useRouter } from "next/navigation"

export function ProcessDashboardCard() {
  const router = useRouter()
  return (
    <DashboardCard
      sx={{
        bgcolor: "secondary.main",
        color: "secondary.contrastText",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <EngineeringOutlined sx={{ fontSize: 40, color: "secondary.contrastText" }} />
        <DashboardCard.Title variant="h5">Processos</DashboardCard.Title>
      </Stack>
      <DashboardCard.Description variant="body2">
        Gerencie os processos cadastrados no sistema. Gerencie os processos cadastrados no
        sistema. Gerencie os processos cadastrados no sistema. Gerencie os processos
        cadastrados no sistema.Gerencie os processos cadastrados no sistema.Gerencie os
        processos cadastrados no sistema.Gerencie os processos cadastrados no
        sistema.Gerencie os processos cadastrados no sistema. Gerencie os processos
        cadastrados no sistema.
      </DashboardCard.Description>
      <Box mt={2}>
        <Button
          variant="outlined"
          size="small"
          color="inherit" // Inherit para ficar legível sobre fundo colorido
          onClick={() => router.push("/dashboard/processos")}
        >
          Ver Processos
        </Button>
      </Box>
    </DashboardCard>
  )
}

export default ProcessDashboardCard
