"use client"

import PersonIcon from "@mui/icons-material/Person"
import TopListCard from "@/components/dashboard/TopListCard"
import type { TopResponsavel } from "@/types/TopResponsaveis"
import { GovBRButton } from "@anpdgovbr/shared-ui"

const MAX_RESPONSAVEIS = 6

export interface ResponsaveisDashboardCardProps {
  limit?: number
}

/**
 * Card do dashboard que exibe os principais responsáveis (usuários) por processos.
 *
 * Descrição:
 * - Componente client-side que, ao montar, faz uma requisição para
 *   `/api/relatorios/top-responsaveis?limit={limit}` para carregar os dados.
 * - Mostra Skeletons enquanto carrega, lista os responsáveis quando disponíveis
 *   e exibe uma mensagem de aviso em caso de erro.
 *
 * Props:
 * - limit (opcional): número máximo de responsáveis a serem exibidos (default: 6).
 *
 * Comportamento:
 * - Faz fetch com cache: "no-store".
 * - Em respostas inválidas ou erros de rede, define estado de erro e
 *   mostra uma mensagem informativa.
 * - Possui um botão de ação que navega para "/dashboard/responsaveis".
 *
 * Retorno:
 * - JSX.Element representando o card com a lista dos responsáveis ou placeholders.
 *
 * Observações:
 * - Componente exportado como default.
 */
function ResponsaveisDashboardCard({
  limit = MAX_RESPONSAVEIS,
}: Readonly<ResponsaveisDashboardCardProps>) {
  const actionBtn = (
    <GovBRButton
      fullWidth
      variant="contained"
      onClick={() => (window.location.href = "/dashboard/responsaveis")}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.2)",
        color: "success.contrastText",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
      }}
    >
      Ver todos
    </GovBRButton>
  )
  return (
    <TopListCard<TopResponsavel[]>
      icon={<PersonIcon />}
      title="Responsáveis"
      subtitle="Equipe Técnica"
      description="Controle de usuários responsáveis por processos."
      color="success"
      fetchUrl={`/api/relatorios/top-responsaveis?limit=${limit}`}
      selectItems={(data) =>
        Array.isArray(data)
          ? data.map((d) => ({ id: d.id, label: d.nome, value: d.totalProcessos }))
          : []
      }
      limit={limit}
      actionButton={actionBtn}
      valueLabel="Processos:"
      itemSize={{ xs: 12, sm: 6 }}
      containerProps={{ columns: 12, alignItems: "stretch" }}
    />
  )
}

export default ResponsaveisDashboardCard
