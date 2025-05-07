import { DashboardCard } from "@/components/ui/dashboard-card"
import { EngineeringOutlined } from "@mui/icons-material"
import { Box, Button, Card, Stack } from "@mui/material"
import { useRouter } from "next/navigation"

export function ProcessDashboardCard() {
  const router = useRouter()

  return (
    <DashboardCard
      sx={{
        height: "100%",
        width: "100%",
        bgcolor: "secondary.light",
        color: "secondary.contrastText",
      }}
    >
      <Box
        width={"100%"}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Box width={"100%"}>
          <Stack direction="row" spacing={2} alignItems="center">
            <EngineeringOutlined sx={{ fontSize: 40, color: "secondary.contrastText" }} />
            <DashboardCard.Title>Processos</DashboardCard.Title>
          </Stack>
          <DashboardCard.Description variant="body2">
            Visão geral e indicadores de processos cadastrados no sistema.
          </DashboardCard.Description>

          <Stack
            direction="row"
            spacing={2}
            mt={1}
            sx={{ width: "100%", height: "100%", border: "red solid 1px" }}
          >
            <Card sx={{ width: "50%", height: "100%" }}>A</Card>
            <Card sx={{ width: "50%", height: "100%" }}>B</Card>
          </Stack>
        </Box>

        <Box mt={2}>
          <Button
            fullWidth
            sx={{ textTransform: "uppercase" }}
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
