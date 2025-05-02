import { DashboardCard } from "@/components/ui/dashboard-card"
import { EngineeringOutlined } from "@mui/icons-material"
import { Box, Button, Stack } from "@mui/material"
import { useRouter } from "next/navigation"

export function ProcessDashboardCard() {
  const router = useRouter()
  return (
    <DashboardCard
      sx={{
        height: "100%",
        bgcolor: "secondary.light",
        color: "secondary.contrastText",
      }}
    >
      <Box
        display="flex" // Adicione isso para tornar a Box um flex container
        flexDirection="column" // Organize os itens em coluna
        justifyContent="space-between" // Distribua o espaço entre os itens
        sx={{ height: "100%" }}
      >
        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <EngineeringOutlined sx={{ fontSize: 40, color: "secondary.contrastText" }} />
            <DashboardCard.Title>Processos</DashboardCard.Title>
          </Stack>
          <DashboardCard.Description variant="body2">
            Gerencie os processos cadastrados no sistema. Gerencie os processos
            cadastrados no sistema. Gerencie os processos cadastrados no sistema. Gerencie
            os processos cadastrados no sistema.Gerencie os processos cadastrados no
            sistema.Gerencie os processos cadastrados no sistema.Gerencie os processos
            cadastrados no sistema.Gerencie os processos cadastrados no sistema. Gerencie
            os processos cadastrados no sistema.
          </DashboardCard.Description>

          {/* inicio conteudo */}

          {/* fim conteudo */}
        </Box>
        <Box mt={2}>
          <Button
            fullWidth
            sx={{
              textTransform: "uppercase",
            }}
            variant="outlined"
            size="small"
            color="inherit"
            onClick={() => router.push("/dashboard/processos")}
          >
            Ver Processos
          </Button>
        </Box>
      </Box>
    </DashboardCard>
  )
}

export default ProcessDashboardCard
