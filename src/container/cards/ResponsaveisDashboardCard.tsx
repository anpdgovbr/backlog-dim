"use client"

import { DashboardCard } from "@/components/ui/dashboard-card"
import type { TopResponsavel } from "@/types/TopResponsaveis"
import { Person } from "@mui/icons-material"
import { Box, Button, Grid, Stack, Tooltip, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const MAX_RESPONSAVEIS = 6

interface ResponsaveisDashboardCardProps {
  limit?: number
}

function ResponsaveisDashboardCard({
  limit = MAX_RESPONSAVEIS,
}: ResponsaveisDashboardCardProps) {
  const router = useRouter()
  const [topResponsaveis, setTopResponsaveis] = useState<TopResponsavel[] | null>(null)

  useEffect(() => {
    const carregarTop = async () => {
      try {
        const res = await fetch(`/api/relatorios/top-responsaveis?limit=${limit}`, {
          cache: "no-store",
        })
        const data = await res.json()
        setTopResponsaveis(data)
      } catch (error) {
        console.error("Erro ao carregar top responsáveis:", error)
      }
    }

    carregarTop()
  }, [limit])

  return (
    <DashboardCard sx={{ bgcolor: "background.paper" }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        <Person sx={{ fontSize: 40, color: "primary.dark" }} />
        <DashboardCard.Title variant="h6">Responsáveis</DashboardCard.Title>
      </Stack>

      <DashboardCard.Description variant="body2" sx={{ mb: 1 }}>
        Controle de usuários responsáveis por processos.
      </DashboardCard.Description>

      <Grid container spacing={1} columns={12}>
        {(topResponsaveis ?? Array.from({ length: 3 })).map(
          (r: TopResponsavel | undefined, idx) => (
            <Grid key={r?.id ?? idx} size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "primary.light",

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
                          color: "primary.contrastText",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                        }}
                      >
                        {r.nome}
                      </Typography>
                    </Tooltip>
                    <Typography variant="caption" color="primary.contrastText">
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

      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Button
          size="small"
          variant="outlined"
          color="success"
          onClick={() => router.push("/dashboard/responsaveis")}
        >
          Ver todos
        </Button>
      </Stack>
    </DashboardCard>
  )
}

export default ResponsaveisDashboardCard
