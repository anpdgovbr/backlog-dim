"use client"

import CrudManager from "@/components/CrudManager"
import { withPermissao } from "@anpdgovbr/rbac-react"

function ContatoPrevioPageContent() {
  return <CrudManager tableName="contatoPrevio" entityName="Contato Prévio" />
}
const ContatoPrevioPage = withPermissao(ContatoPrevioPageContent, "Exibir", "Metadados", {
  redirect: false,
})

export default ContatoPrevioPage
