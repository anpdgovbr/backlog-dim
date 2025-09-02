"use client"

import CrudManager from "@/components/CrudManager"
import { withPermissao } from "@anpdgovbr/rbac-react"

function FormaEntradaPageContent() {
  return <CrudManager tableName="FormaEntrada" entityName="Forma de Entrada" />
}
const FormaEntradaPage = withPermissao(FormaEntradaPageContent, "Exibir", "Metadados", {
  redirect: false,
})
export default FormaEntradaPage
