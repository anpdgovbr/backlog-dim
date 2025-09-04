"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import BusinessIcon from "@mui/icons-material/Business"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import Grid from "@mui/material/Grid"
import Skeleton from "@mui/material/Skeleton"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { BaseDashboardCard } from "@/components/ui/dashboard-card"
import type { TopRequerido } from "@/types/TopRequeridos"

/**
 * Valor padrão máximo de requeridos exibidos no card.
 *
 * É usado como fallback quando a prop `limit` não é informada.
 */
export const MAX_REQUERIDOS = 5

/**
 * Props do componente RequeridosDashboardCard.
 *
 * - limit: número máximo de requeridos a serem exibidos. O valor padrão é
 *   {@link MAX_REQUERIDOS}.
 */
export type RequeridosDashboardCardProps = Readonly<{
  limit?: number
}>

/**
 * Card do dashboard que exibe o "top" de requeridos (empresas) com mais processos.
 *
 * Comportamento:
 * - Ao montar, busca via fetch em /api/relatorios/top-requeridos?limit={limit} os
 *   dados dos principais requeridos (cache: no-store).
 * - Exibe estado de loading com Skeletons enquanto os dados não chegam.
 * - Em caso de erro de rede ou resposta inesperada, mostra uma mensagem de aviso
 *   e lista vazia.
 * - Possui um botão de ação que navega para "/dashboard/requeridos".
 *
 * Efeitos colaterais:
 * - Realiza uma requisição HTTP (fetch) no useEffect dependente de `limit`.
 * - Atualiza estados locais `topRequeridos` e `erro`.
 *
 * Observações:
 * - As props são imutáveis (tipadas com Readonly).
 * - O componente é cliente ("use client") e usa hooks de navegação do Next.js.
 *
 * @param limit limite opcional de itens a serem exibidos (padrão: {@link MAX_REQUERIDOS})
 * @returns JSX.Element representando o card de requeridos
 */
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
    <GovBRButton
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
    </GovBRButton>
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
