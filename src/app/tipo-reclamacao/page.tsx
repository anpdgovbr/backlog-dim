import CrudManager from "@/components/CrudManager"
import withPermissao from "@/hoc/withPermissao"

function TipoReclamacaoPageContent() {
  return <CrudManager tableName="TipoReclamacao" entityName="Tipos de Reclamação" />
}
const TipoReclamacaoPage = withPermissao(
  TipoReclamacaoPageContent,
  "Exibir",
  "Metadados",
  {
    redirecionar: false,
  }
)
export default TipoReclamacaoPage
