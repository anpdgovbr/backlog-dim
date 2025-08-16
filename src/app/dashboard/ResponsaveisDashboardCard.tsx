"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import PersonIcon from "@mui/icons-material/Person"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { DashboardCard } from "@/components/ui/dashboard-card"
import type { TopResponsavel } from "@/types/TopResponsaveis"

const MAX_RESPONSAVEIS = 6

interface ResponsaveisDashboardCardProps {
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

  return (
    <>
      <DashboardCard
        sx={{
          height: "100%",
          bgcolor: "success.main",
          color: "success.contrastText",
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
              <PersonIcon
                sx={{ fontSize: 48, color: "success.contrastText", opacity: 0.9 }}
              />
              <Box>
                <DashboardCard.Title sx={{ color: "success.contrastText" }}>
                  Responsáveis
                </DashboardCard.Title>
                <Typography
                  variant="caption"
                  sx={{ color: "success.contrastText", opacity: 0.8 }}
                >
                  Equipe Técnica
                </Typography>
              </Box>
            </Stack>

            <DashboardCard.Description
              variant="body2"
              sx={{ mb: 2, color: "success.contrastText", opacity: 0.9 }}
            >
              Controle de usuários responsáveis por processos.
            </DashboardCard.Description>
            {erro && (
              <Typography
                variant="body2"
                color="warning.main"
                mb={1}
                sx={{ fontWeight: 600 }}
              >
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
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
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
                          <Box
                            sx={{
                              width: "80%",
                              height: 16,
                              bgcolor: "grey.300",
                              borderRadius: 1,
                            }}
                          />
                          <Box
                            sx={{
                              width: "40%",
                              height: 12,
                              bgcolor: "grey.200",
                              borderRadius: 1,
                              mt: 0.5,
                            }}
                          />
                        </>
                      )}
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          </Box>
          <Box mt={2}>
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
    </>
  )
}

export default ResponsaveisDashboardCard
