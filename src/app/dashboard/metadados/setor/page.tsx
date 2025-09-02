"use client"

import CrudManager from "@/components/CrudManager"
import { withPermissao } from "@anpdgovbr/rbac-react"

function SetorPageContent() {
  return <CrudManager tableName="Setor" entityName="Setores" />
}
const SetorPage = withPermissao(SetorPageContent, "Exibir", "Metadados", {
  redirect: false,
})

export default SetorPage
