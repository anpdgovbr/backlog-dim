"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import PersonIcon from "@mui/icons-material/Person"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Skeleton from "@mui/material/Skeleton"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { BaseDashboardCard } from "@/components/ui/dashboard-card"
import type { TopResponsavel } from "@/types/TopResponsaveis"

const MAX_RESPONSAVEIS = 6

export interface ResponsaveisDashboardCardProps {
  limit?: number
}

function ResponsaveisDashboardCard({
  limit = MAX_RESPONSAVEIS,
}: ResponsaveisDashboardCardProps) {
  const router = useRouter()
  const [topResponsaveis, setTopResponsaveis] = useState<TopResponsavel[] | null>(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    const carregarTop = async () => {
      try {
        const res = await fetch(`/api/relatorios/top-responsaveis?limit=${limit}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          setErro(true)
          setTopResponsaveis([])
          return
        }

        const data = await res.json()
        if (Array.isArray(data)) {
          setTopResponsaveis(data)
        } else {
          setErro(true)
          setTopResponsaveis([])
        }
      } catch (error) {
        setErro(true)
        setTopResponsaveis([])
        console.error("Erro ao carregar top responsáveis:", error)
      }
    }

    carregarTop()
  }, [limit])

  const actionButton = (
    <Button
      fullWidth
      variant="contained"
      size="large"
      onClick={() => router.push("/dashboard/responsaveis")}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.2)",
        color: "success.contrastText",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.3)",
        },
      }}
    >
      Ver todos
    </Button>
  )

  return (
    <BaseDashboardCard
      icon={<PersonIcon />}
      title="Responsáveis"
      subtitle="Equipe Técnica"
      description="Controle de usuários responsáveis por processos."
      color="success"
      actionButton={actionButton}
    >
      {erro && (
        <Typography variant="body2" color="warning.main" mb={1} sx={{ fontWeight: 600 }}>
          Não foi possível carregar os responsáveis. Verifique se está autenticado.
        </Typography>
      )}
      <Grid container spacing={1} columns={12} alignItems="stretch">
        {(topResponsaveis ?? Array.from({ length: 3 })).map(
          (r: TopResponsavel | undefined, idx) => (
            <Grid key={r?.id ?? idx} size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  /* suavizar o fundo para reduzir saturação */
                  bgcolor: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {r ? (
                  <>
                    <Tooltip title={r.nome}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "success.contrastText",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          fontWeight: 600,
                        }}
                      >
                        {r.nome}
                      </Typography>
                    </Tooltip>
                    <Typography variant="caption" color="success.contrastText">
                      Processos: {r.totalProcessos}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Skeleton variant="text" width="80%" sx={{ bgcolor: "grey.400" }} />
                    <Skeleton variant="text" width="40%" sx={{ bgcolor: "grey.400" }} />
                  </>
                )}
              </Box>
            </Grid>
          )
        )}
      </Grid>
    </BaseDashboardCard>
  )
}

export default ResponsaveisDashboardCard
