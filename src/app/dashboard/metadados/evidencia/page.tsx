"use client"

import CrudManager from "@/components/CrudManager"
import { withPermissao } from "@anpdgovbr/rbac-react"

function EvidenciaPageContent() {
  return <CrudManager tableName="Evidencia" entityName="Evidência" />
}

const EvidenciaPage = withPermissao(EvidenciaPageContent, "Exibir", "Metadados", {
  redirect: false,
})

export default EvidenciaPage
