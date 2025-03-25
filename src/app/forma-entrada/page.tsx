import CrudManager from "@/components/CrudManager"
import withPermissao from "@/hoc/withPermissao"

function FormaEntradaPageContent() {
  return <CrudManager tableName="FormaEntrada" entityName="Forma de Entrada" />
}
const FormaEntradaPage = withPermissao(FormaEntradaPageContent, "Exibir", "Metadados", {
  redirecionar: false,
})
export default FormaEntradaPage
