"use client"

import CrudManager from "@/components/CrudManager"
import { withPermissao } from "@anpdgovbr/rbac-react"

function PedidoManifestacaoPageContent() {
  return (
    <CrudManager tableName="PedidoManifestacao" entityName="Pedidos de Manifestação" />
  )
}
const PedidoManifestacaoPage = withPermissao(
  PedidoManifestacaoPageContent,
  "Exibir",
  "Metadados",
  { redirect: false }
)

export default PedidoManifestacaoPage
