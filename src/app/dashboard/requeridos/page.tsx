"use client"

import RequeridoDataGrid from "@/components/requerido/RequeridoDataGrid"
import { withPermissao } from "@anpdgovbr/rbac-react"

function GerenciarRequeridosContent() {
  return <RequeridoDataGrid />
}

const GerenciarRequeridos = withPermissao(
  GerenciarRequeridosContent,
  "Exibir",
  "Responsavel",
  {
    redirect: false,
  }
)

export default GerenciarRequeridos
