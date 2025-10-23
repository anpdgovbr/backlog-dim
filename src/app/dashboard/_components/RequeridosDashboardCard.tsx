import BusinessIcon from "@mui/icons-material/Business"
import TopListCard from "@/components/dashboard/TopListCard"
import type { TopRequerido } from "@/types/TopRequeridos"
import { GovBRButton } from "@anpdgovbr/shared-ui"

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
export type RequeridosDashboardCardProps = Readonly<{ limit?: number }>

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
  const actionBtn = (
    <GovBRButton
      fullWidth
      variant="contained"
      onClick={() => (window.location.href = "/dashboard/requeridos")}
      sx={{
        bgcolor: "rgba(0, 0, 0, 0.12)",
        color: "secondary.contrastText",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 0, 0, 0.18)",
        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.18)" },
      }}
    >
      Ver todos
    </GovBRButton>
  )
  return (
    <TopListCard<TopRequerido[]>
      icon={<BusinessIcon />}
      title="Requeridos"
      subtitle="Top Empresas"
      description="Acesse os principais requeridos com mais processos."
      color="secondary"
      fetchUrl={`/api/relatorios/top-requeridos?limit=${limit}`}
      selectItems={(data) =>
        Array.isArray(data)
          ? data.map((d) => ({
              id: d.id,
              label: d.nomeEmpresarial ?? d.nomeFantasia ?? "--",
              value: d.totalProcessos,
            }))
          : []
      }
      limit={limit}
      actionButton={actionBtn}
      valueLabel="Processos:"
    />
  )
}

export default RequeridosDashboardCard
