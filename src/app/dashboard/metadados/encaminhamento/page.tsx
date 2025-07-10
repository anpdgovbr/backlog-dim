"use client"

import CrudManager from "@/components/CrudManager"
import withPermissao from "@/hoc/withPermissao"

function EncaminhamentoPageContent() {
  return <CrudManager tableName="Encaminhamento" entityName="Encaminhamento" />
}

const EncaminhamentoPage = withPermissao(
  EncaminhamentoPageContent,
  "Exibir",
  "Metadados",
  {
    redirecionar: false,
  }
)

export default EncaminhamentoPage
