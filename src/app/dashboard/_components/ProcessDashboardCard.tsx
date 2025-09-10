import { useRouter } from "next/navigation"

import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { BaseDashboardCard } from "@/components/ui/dashboard-card"
import { GovBRButton } from "@anpdgovbr/shared-ui"

/**
 * Componente de card para o dashboard que apresenta um resumo dos processos do
 * sistema e fornece uma ação direta para navegar ao gerenciador de processos.
 *
 * Comportamento:
 * - Mostra métricas resumidas (ex.: total ativo, pendentes) em pequenos cards.
 * - Exibe chips com estados/filtragens rápidas (Ex.: "Em Análise", "Aguardando").
 * - Fornece um botão principal que redireciona para a rota "/dashboard/processos".
 *
 * Uso:
 * <ProcessDashboardCard />
 *
 * Retorno:
 * JSX.Element contendo a estrutura visual do card compatível com o layout do dashboard.
 */
export function ProcessDashboardCard() {
  const router = useRouter()

  const actionButton = (
    <GovBRButton
      fullWidth
      variant="contained"
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
    </GovBRButton>
  )

  return (
    <BaseDashboardCard
      icon={<EngineeringOutlinedIcon />}
      title="Processos"
      subtitle="Sistema de Gestão"
      description="Controle e acompanhamento completo dos processos administrativos da DIM."
      color="primary"
      actionButton={actionButton}
    >
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 6 }}>
          <Card
            sx={{
              /* diminuir opacidade do fundo interno para reduzir saturação */
              bgcolor: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TrendingUpIcon sx={{ fontSize: 24, color: "primary.contrastText" }} />
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
              /* diminuir opacidade do fundo interno para reduzir saturação */
              bgcolor: "rgba(255, 255, 255, 0.08)",
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
                  <Typography variant="caption" sx={{ color: "white", fontWeight: 700 }}>
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
    </BaseDashboardCard>
  )
}

export default ProcessDashboardCard
