"use client"

import CrudManager from "@/components/CrudManager"
import withPermissao from "@/hoc/withPermissao"

function EvidenciaPageContent() {
  return <CrudManager tableName="Evidencia" entityName="Evidência" />
}

const EvidenciaPage = withPermissao(EvidenciaPageContent, "Exibir", "Metadados", {
  redirecionar: false,
})

export default EvidenciaPage
