"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import BusinessIcon from "@mui/icons-material/Business"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Skeleton from "@mui/material/Skeleton"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { BaseDashboardCard } from "@/components/ui/dashboard-card"
import type { TopRequerido } from "@/types/TopRequeridos"

const MAX_REQUERIDOS = 5

type RequeridosDashboardCardProps = Readonly<{
  limit?: number
}>

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

  const actionButton = (
    <Button
      fullWidth
      variant="contained"
      size="large"
      onClick={() => router.push("/dashboard/requeridos")}
      sx={{
        bgcolor: "rgba(0, 0, 0, 0.12)",
        color: "secondary.contrastText",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 0, 0, 0.18)",
        "&:hover": {
          bgcolor: "rgba(0, 0, 0, 0.18)",
        },
      }}
    >
      Ver todos
    </Button>
  )

  return (
    <BaseDashboardCard
      icon={<BusinessIcon />}
      title="Requeridos"
      subtitle="Top Empresas"
      description="Acesse os principais requeridos com mais processos."
      color="secondary"
      actionButton={actionButton}
    >
      {erro && (
        <Typography variant="body2" color="warning.main" mb={1} sx={{ fontWeight: 600 }}>
          Não foi possível carregar os requeridos. Verifique se está autenticado.
        </Typography>
      )}
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {(topRequeridos ?? Array.from({ length: 3 })).map((r, i) => (
          <Grid
            key={r?.id ?? i}
            size={{ xs: 12 }}
            sx={{
              px: 1.5,
              py: 1,
              /* suavizar o fundo para melhorar leitura */
              bgcolor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 1,
              overflow: "hidden",
              width: "100%",
            }}
          >
            {r ? (
              <>
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
              </>
            ) : (
              <>
                <Skeleton variant="text" width="80%" sx={{ bgcolor: "grey.400" }} />
                <Skeleton variant="text" width="40%" sx={{ bgcolor: "grey.400" }} />
              </>
            )}
          </Grid>
        ))}
      </Grid>
    </BaseDashboardCard>
  )
}

export default RequeridosDashboardCard
