import CrudManager from "@/components/CrudManager"
import withPermissao from "@/hoc/withPermissao"

function ContatoPrevioPageContent() {
  return <CrudManager tableName="contatoPrevio" entityName="Contato Prévio" />
}
const ContatoPrevioPage = withPermissao(ContatoPrevioPageContent, "Exibir", "Metadados", {
  redirecionar: false,
})

export default ContatoPrevioPage
