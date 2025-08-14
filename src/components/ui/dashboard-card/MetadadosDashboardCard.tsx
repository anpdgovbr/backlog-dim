import { useRouter } from "next/navigation"

import TableChartIcon from "@mui/icons-material/TableChart"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { DashboardCard } from "@/components/ui/dashboard-card"

function MetadadosDashboardCard() {
  const router = useRouter()
  return (
    <DashboardCard
      hasAction
      action={() => router.push("/dashboard/metadados")}
      sx={{
        bgcolor: "info.main",
        color: "info.contrastText",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <TableChartIcon
              sx={{ fontSize: 48, color: "info.contrastText", opacity: 0.9 }}
            />
            <Box>
              <DashboardCard.Title sx={{ color: "info.contrastText" }}>
                Metadados
              </DashboardCard.Title>
              <Typography
                variant="caption"
                sx={{ color: "info.contrastText", opacity: 0.8 }}
              >
                Configurações do Sistema
              </Typography>
            </Box>
          </Stack>
          <DashboardCard.Description
            variant="body2"
            sx={{ color: "info.contrastText", opacity: 0.9 }}
          >
            Gerencie tipos de encaminhamento, evidências e outras categorias auxiliares.
          </DashboardCard.Description>
        </Box>
      </Box>

      {/* Elemento decorativo */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.05)",
          zIndex: 0,
        }}
      />
    </DashboardCard>
  )
}

export default MetadadosDashboardCard
