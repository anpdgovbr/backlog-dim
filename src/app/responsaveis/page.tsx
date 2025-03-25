import CrudManager from "@/components/CrudManager"
import withPermissao from "@/hoc/withPermissao"

function ResponsaveisPageContent() {
  return (
    <CrudManager tableName="Responsavel" entityName="Responsáveis pelos atendimentos" />
  )
}

const ResponsaveisPage = withPermissao(ResponsaveisPageContent, "Exibir", "Responsavel", {
  redirecionar: false,
})

export default ResponsaveisPage
