import { useRouter } from "next/navigation"

import UploadFile from "@mui/icons-material/UploadFile"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { DashboardCard } from "@/components/ui/dashboard-card"

function ImportarDashboardCard() {
  const router = useRouter()

  return (
    <DashboardCard
      hasAction
      action={() => router.push("/dashboard/importar")}
      sx={{
        bgcolor: "accent.main",
        color: "accent.contrastText",
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
            <UploadFile
              sx={{ fontSize: 48, color: "accent.contrastText", opacity: 0.9 }}
            />
            <Box>
              <DashboardCard.Title variant="h4" sx={{ color: "accent.contrastText" }}>
                Importar processos
              </DashboardCard.Title>
              <Typography
                variant="caption"
                sx={{ color: "accent.contrastText", opacity: 0.8 }}
              >
                Carga em Lote
              </Typography>
            </Box>
          </Stack>

          <DashboardCard.Description
            variant="body2"
            sx={{ color: "accent.contrastText", opacity: 0.9 }}
          >
            Importe arquivos CSV oriundos do Sistema de Denúncia e Peticionamento. Essa
            funcionalidade permite a carga estruturada de múltiplos processos em lote.
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
          bgcolor: "rgba(0, 0, 0, 0.05)",
          zIndex: 0,
        }}
      />
    </DashboardCard>
  )
}

export default ImportarDashboardCard
