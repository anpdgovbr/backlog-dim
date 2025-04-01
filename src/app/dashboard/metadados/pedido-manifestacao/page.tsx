"use client"

import CrudManager from "@/components/CrudManager"
import withPermissao from "@/hoc/withPermissao"

function PedidoManifestacaoPageContent() {
  return (
    <CrudManager tableName="PedidoManifestacao" entityName="Pedidos de Manifestação" />
  )
}
const PedidoManifestacaoPage = withPermissao(
  PedidoManifestacaoPageContent,
  "Exibir",
  "Metadados",
  { redirecionar: false }
)

export default PedidoManifestacaoPage
