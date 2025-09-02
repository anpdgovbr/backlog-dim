"use client"

import CrudManager from "@/components/CrudManager"
import { withPermissao } from "@anpdgovbr/rbac-react"

function ResponsaveisPageContent() {
  return (
    <CrudManager tableName="Responsavel" entityName="Responsáveis pelos atendimentos" />
  )
}

const ResponsaveisPage = withPermissao(ResponsaveisPageContent, "Exibir", "Responsavel", {
  redirect: false,
})

export default ResponsaveisPage
