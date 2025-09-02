"use client"

import CrudManager from "@/components/CrudManager"
import { withPermissao } from "@anpdgovbr/rbac-react"

function EncaminhamentoPageContent() {
  return <CrudManager tableName="Encaminhamento" entityName="Encaminhamento" />
}

const EncaminhamentoPage = withPermissao(
  EncaminhamentoPageContent,
  "Exibir",
  "Metadados",
  {
    redirect: false,
  }
)

export default EncaminhamentoPage
