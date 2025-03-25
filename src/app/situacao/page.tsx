import CrudManager from "@/components/CrudManager"
import withPermissao from "@/hoc/withPermissao"

function SituacaoPageContent() {
  return <CrudManager tableName="Situacao" entityName="Situação" />
}

const SituacaoPage = withPermissao(SituacaoPageContent, "Exibir", "Metadados", {
  redirecionar: false,
})

export default SituacaoPage
