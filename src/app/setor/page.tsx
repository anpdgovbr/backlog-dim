import CrudManager from "@/components/CrudManager"
import withPermissao from "@/hoc/withPermissao"

function SetorPageContent() {
  return <CrudManager tableName="Setor" entityName="Setores" />
}
const SetorPage = withPermissao(SetorPageContent, "Exibir", "Metadados", {
  redirecionar: false,
})

export default SetorPage
