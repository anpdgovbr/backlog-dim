"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"
import Button, { type ButtonProps } from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Skeleton from "@mui/material/Skeleton"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import {
  BaseDashboardCard,
  type BaseDashboardCardProps,
} from "@/components/ui/dashboard-card"

/**
 * Item normalizado para exibição em {@link TopListCard}.
 *
 * - id: identificador único do item (string ou number)
 * - label: texto principal do item (ex.: nome)
 * - value: valor numérico ou textual complementar (ex.: quantidade)
 */
export type TopListCardItem = Readonly<{
  id: string | number
  label: string
  value?: number | string
}>

/**
 * Props do {@link TopListCard}.
 *
 * Este componente generaliza o padrão dos cards de "Top N" listas do dashboard
 * (ex.: Requeridos, Responsáveis), abstraindo a busca, estados de loading/erro
 * e a renderização com estilos consistentes.
 */
export interface TopListCardProps<T = unknown>
  extends Pick<
    BaseDashboardCardProps,
    "icon" | "title" | "subtitle" | "description" | "color" | "textColorOverride"
  > {
  /** Endpoint de onde os dados serão buscados (GET). */
  fetchUrl: string
  /**
   * Função que mapeia a resposta (JSON) do endpoint em uma lista de items
   * normalizados ({@link TopListCardItem}).
   */
  selectItems: (data: T) => TopListCardItem[]
  /** Máximo de itens exibidos (default: 5). */
  limit?: number
  /** Texto do botão de ação (ex.: "Ver todos"). */
  actionText?: string
  /** Rota para navegar ao clicar no botão (alternativa a onAction). */
  actionHref?: string
  /** Callback opcional executado ao clicar na ação. */
  onAction?: () => void
  /** Sobrescreve totalmente o botão de ação. Quando presente, ignora actionText/onAction/actionHref. */
  actionButton?: React.ReactNode
  /** Props opcionais para estilizar o botão padrão (quando não for fornecido actionButton). */
  actionProps?: Partial<ButtonProps>
  /** Mensagem exibida quando ocorre erro na busca. */
  errorText?: string
  /** Quantidade de skeletons durante carregamento (default: 3). */
  skeletonCount?: number
  /** Quantidade máxima de linhas do label (default: 2). */
  labelMaxLines?: number
  /** Rótulo antes do valor (ex.: "Processos:") */
  valueLabel?: string
  /** Tamanho dos itens na grid (ex.: { xs:12, sm:6 } para 2 colunas no sm+). */
  itemSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
  /** Props do container da grid (ex.: { columns:12, alignItems:'stretch' }). */
  containerProps?: Partial<React.ComponentProps<typeof Grid>>
}

/**
 * Componente genérico para cards de "Top N" no dashboard.
 *
 * Padrões:
 * - Busca automática ao montar (`fetchUrl`, cache: no-store).
 * - Exibe skeletons enquanto carrega e mensagem curta em caso de erro.
 * - Lista itens normalizados (id, label, value) no estilo dos cards do dashboard.
 * - Ação configurável por `actionHref` (router.push) ou `onAction` custom.
 */
export function TopListCard<T = unknown>({
  icon,
  title,
  subtitle,
  description,
  color = "primary",
  textColorOverride,
  fetchUrl,
  selectItems,
  limit = 5,
  actionText,
  actionHref,
  onAction,
  actionButton,
  actionProps,
  errorText = "Não foi possível carregar os dados.",
  skeletonCount = 3,
  labelMaxLines = 2,
  valueLabel,
  itemSize,
  containerProps,
}: Readonly<TopListCardProps<T>>) {
  const router = useRouter()
  const [items, setItems] = useState<TopListCardItem[] | null>(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    let mounted = true
    const carregar = async () => {
      try {
        const res = await fetch(fetchUrl, { cache: "no-store" })
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as T
        const mapped = selectItems(data)
        if (mounted) setItems(Array.isArray(mapped) ? mapped : [])
      } catch (error) {
        console.error("Erro ao carregar dados do TopListCard:", error)
        if (mounted) {
          setErro(true)
          setItems([])
        }
      }
    }
    carregar()
    return () => {
      mounted = false
    }
  }, [fetchUrl, selectItems])

  const handleAction = useCallback(() => {
    if (onAction) onAction()
    else if (actionHref) router.push(actionHref)
  }, [onAction, actionHref, router])

  const computedActionButton = useMemo(() => {
    if (actionButton) return actionButton
    if (!actionText) return null
    return (
      <Button
        fullWidth
        variant="contained"
        onClick={handleAction}
        sx={{
          bgcolor: "rgba(0, 0, 0, 0.12)",
          color: `${color}.contrastText`,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 0, 0, 0.18)",
          "&:hover": { bgcolor: "rgba(0, 0, 0, 0.18)" },
          ...(actionProps?.sx as object),
        }}
        {...actionProps}
      >
        {actionText}
      </Button>
    )
  }, [actionButton, actionText, color, handleAction, actionProps])

  const list = items ?? Array.from({ length: skeletonCount })

  return (
    <BaseDashboardCard
      icon={icon}
      title={title}
      subtitle={subtitle}
      description={description}
      color={color}
      textColorOverride={textColorOverride}
      actionButton={computedActionButton}
    >
      {erro && (
        <Typography
          variant="body2"
          color={`${color}.contrastText`}
          sx={{ mb: 1, fontWeight: 600 }}
        >
          {errorText}
        </Typography>
      )}
      <Grid container spacing={1} sx={{ mt: 1 }} {...containerProps}>
        {list.slice(0, limit).map((raw, i) => {
          const r = raw as TopListCardItem | undefined
          return (
            <Grid
              key={r?.id ?? i}
              size={itemSize ?? { xs: 12 }}
              sx={{
                px: 0.5,
                py: 1,
                bgcolor: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 1,
                overflow: "hidden",
                width: "100%",
              }}
            >
              {r ? (
                <Box>
                  <Tooltip title={r.label}>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: labelMaxLines,
                        overflow: "hidden",
                        fontWeight: 600,
                        color: `${color}.contrastText`,
                      }}
                    >
                      {r.label}
                    </Typography>
                  </Tooltip>
                  {typeof r.value !== "undefined" && (
                    <Typography variant="caption" sx={{ color: `${color}.contrastText` }}>
                      {valueLabel ? `${valueLabel} ` : null}
                      {r.value}
                    </Typography>
                  )}
                </Box>
              ) : (
                <>
                  <Skeleton variant="text" width="80%" sx={{ bgcolor: "grey.400" }} />
                  <Skeleton variant="text" width="40%" sx={{ bgcolor: "grey.400" }} />
                </>
              )}
            </Grid>
          )
        })}
      </Grid>
    </BaseDashboardCard>
  )
}

export default TopListCard
