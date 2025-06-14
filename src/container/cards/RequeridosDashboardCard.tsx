"use client"

import { DashboardCard } from "@/components/ui/dashboard-card"
import type { TopRequerido } from "@/types/TopRequeridos"
import { Business } from "@mui/icons-material"
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const MAX_REQUERIDOS = 5

interface RequeridosDashboardCardProps {
  limit?: number
}

function RequeridosDashboardCard({
  limit = MAX_REQUERIDOS,
}: RequeridosDashboardCardProps) {
  const router = useRouter()
  const [topRequeridos, setTopRequeridos] = useState<TopRequerido[] | null>(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    const carregarTop = async () => {
      try {
        const res = await fetch(`/api/relatorios/top-requeridos?limit=${limit}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          console.warn("Erro ao buscar dados dos requeridos:", res.status)
          setErro(true)
          setTopRequeridos([])
          return
        }

        const data = await res.json()

        if (Array.isArray(data)) {
          setTopRequeridos(data)
        } else {
          console.warn("Resposta inesperada:", data)
          setErro(true)
          setTopRequeridos([])
        }
      } catch (error) {
        console.error("Erro ao carregar top requeridos:", error)
        setErro(true)
        setTopRequeridos([])
      }
    }

    carregarTop()
  }, [limit])

  return (
    <DashboardCard sx={{ height: "100%", bgcolor: "background.paper" }}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <Business sx={{ fontSize: 40, color: "secondary.dark" }} />
            <DashboardCard.Title>Requeridos</DashboardCard.Title>
          </Stack>

          <DashboardCard.Description variant="body2" sx={{ mb: 1 }}>
            Acesse os principais requeridos com mais processos.
          </DashboardCard.Description>

          {erro && (
            <Typography variant="body2" color="error" mb={1}>
              Não foi possível carregar os requeridos. Verifique se está autenticado.
            </Typography>
          )}

          {topRequeridos === null ? (
            <List dense disablePadding>
              {Array.from({ length: 3 }).map((_, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemText
                    primary={<Skeleton width="80%" />}
                    secondary={<Skeleton width="40%" />}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {(topRequeridos ?? []).map((r) => (
                <Grid
                  key={r.id}
                  size={{ xs: 12 }}
                  sx={{
                    px: 1.5,
                    py: 1,
                    bgcolor: "secondary.light",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <Tooltip title={r.nome}>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        color: "secondary.contrastText",
                        fontWeight: 600,
                      }}
                    >
                      {r.nome}
                    </Typography>
                  </Tooltip>
                  <Typography variant="caption" color="secondary.contrastText">
                    Processos: {r.totalProcessos}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box mt={2}>
          <Button
            fullWidth
            sx={{ textTransform: "uppercase" }}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => router.push("/dashboard/requeridos")}
          >
            Ver todos
          </Button>
        </Box>
      </Box>
    </DashboardCard>
  )
}

export default RequeridosDashboardCard
