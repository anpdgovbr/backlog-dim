"use client"

import CrudManager from "@/components/CrudManager"
import { withPermissao } from "@anpdgovbr/rbac-react"

function SituacaoPageContent() {
  return <CrudManager tableName="Situacao" entityName="Situação" />
}

const SituacaoPage = withPermissao(SituacaoPageContent, "Exibir", "Metadados", {
  redirect: false,
})

export default SituacaoPage
