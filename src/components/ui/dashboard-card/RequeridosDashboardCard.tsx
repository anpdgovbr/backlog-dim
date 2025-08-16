"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import BusinessIcon from "@mui/icons-material/Business"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { DashboardCard } from "@/components/ui/dashboard-card"
import type { TopRequerido } from "@/types/TopRequeridos"

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
    <DashboardCard
      sx={{
        height: "100%",
        bgcolor: "secondary.main",
        color: "secondary.contrastText",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <BusinessIcon
              sx={{ fontSize: 48, color: "secondary.contrastText", opacity: 0.9 }}
            />
            <Box>
              <DashboardCard.Title sx={{ color: "secondary.contrastText" }}>
                Requeridos
              </DashboardCard.Title>
              <Typography
                variant="caption"
                sx={{ color: "secondary.contrastText", opacity: 0.8 }}
              >
                Top Empresas
              </Typography>
            </Box>
          </Stack>

          <DashboardCard.Description
            variant="body2"
            sx={{ mb: 2, color: "secondary.contrastText", opacity: 0.9 }}
          >
            Acesse os principais requeridos com mais processos.
          </DashboardCard.Description>

          {erro && (
            <Typography
              variant="body2"
              color="warning.main"
              mb={1}
              sx={{ fontWeight: 600 }}
            >
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
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 1,
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
            variant="contained"
            size="large"
            onClick={() => router.push("/dashboard/requeridos")}
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.2)",
              color: "secondary.contrastText",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0, 0, 0, 0.3)",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Ver todos
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
          bgcolor: "rgba(0, 0, 0, 0.05)",
          zIndex: 0,
        }}
      />
    </DashboardCard>
  )
}

export default RequeridosDashboardCard
