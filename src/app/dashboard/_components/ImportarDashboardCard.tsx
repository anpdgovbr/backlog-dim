import { useRouter } from "next/navigation"

import UploadFile from "@mui/icons-material/UploadFile"

import { BaseDashboardCard } from "@/components/ui/dashboard-card"

/**
 * Componente que renderiza um card do dashboard para a funcionalidade de
 * importação de processos em lote.
 *
 * O card apresenta ícone, título, subtítulo e descrição e, ao ser acionado,
 * navega o usuário para a rota "/dashboard/importar".
 *
 * Uso:
 * <ImportarDashboardCard />
 *
 * Comportamento:
 * - Exibe informações resumidas sobre a funcionalidade de importação.
 * - Ao executar a ação (clique), chama router.push("/dashboard/importar").
 *
 * @returns JSX.Element - Card pronto para ser exibido no dashboard.
 */
function ImportarDashboardCard() {
  const router = useRouter()

  return (
    <BaseDashboardCard
      icon={<UploadFile />}
      title="Importar processos"
      subtitle="Carga em Lote"
      description="Importe arquivos CSV oriundos do Sistema de Denúncia e Peticionamento. Essa funcionalidade permite a carga estruturada de múltiplos processos em lote."
      action={() => router.push("/dashboard/importar")}
      color="accent"
      /* forçar texto mais escuro para melhorar contraste sobre tons claros */
      textColorOverride="rgba(0,0,0,0.88)"
    />
  )
}

export default ImportarDashboardCard
