"use client"

import CrudManager from "@/components/CrudManager"
import { withPermissao } from "@anpdgovbr/rbac-react"

function TipoReclamacaoPageContent() {
  return <CrudManager tableName="TipoReclamacao" entityName="Tipos de Reclamação" />
}
const TipoReclamacaoPage = withPermissao(
  TipoReclamacaoPageContent,
  "Exibir",
  "Metadados",
  {
    redirect: false,
  }
)
export default TipoReclamacaoPage
