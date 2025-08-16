import { useRouter } from "next/navigation"

import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { DashboardCard } from "@/components/ui/dashboard-card"

export function ProcessDashboardCard() {
  const router = useRouter()

  return (
    <DashboardCard
      sx={{
        height: "100%",
        width: "100%",
        bgcolor: "primary.main",
        color: "primary.contrastText",
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
        <Box width="100%">
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <EngineeringOutlinedIcon
              sx={{ fontSize: 48, color: "primary.contrastText", opacity: 0.9 }}
            />
            <Box>
              <DashboardCard.Title sx={{ color: "primary.contrastText" }}>
                Processos
              </DashboardCard.Title>
              <Typography
                variant="caption"
                sx={{ color: "primary.contrastText", opacity: 0.8 }}
              >
                Sistema de Gestão
              </Typography>
            </Box>
          </Stack>

          <DashboardCard.Description variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Controle e acompanhamento completo dos processos administrativos da DIM.
          </DashboardCard.Description>

          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 6 }}>
              <Card
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUpIcon
                      sx={{ fontSize: 24, color: "primary.contrastText" }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "primary.contrastText", fontWeight: 700 }}
                      >
                        1.247
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "primary.contrastText", opacity: 0.8 }}
                      >
                        Total Ativo
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Card
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: "warning.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "white", fontWeight: 700 }}
                      >
                        !
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "primary.contrastText", fontWeight: 700 }}
                      >
                        89
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "primary.contrastText", opacity: 0.8 }}
                      >
                        Pendentes
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Chip
              label="Em Análise"
              size="small"
              sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "primary.contrastText" }}
            />
            <Chip
              label="Aguardando"
              size="small"
              sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "primary.contrastText" }}
            />
            <Chip
              label="Concluídos"
              size="small"
              sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "primary.contrastText" }}
            />
          </Stack>
        </Box>

        <Box mt={3}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => router.push("/dashboard/processos")}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "primary.contrastText",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            Gerenciar Processos
          </Button>
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

export default ProcessDashboardCard
