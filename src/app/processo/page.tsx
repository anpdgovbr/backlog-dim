"use client"

import ProcessoDataGrid from "@/components/processo/ProcessoDataGrid"
import withPermissao from "@/hoc/withPermissao"

function GerenciarProcessosContent() {
  return <ProcessoDataGrid />
}

const GerenciarProcessos = withPermissao(
  GerenciarProcessosContent,
  "Exibir",
  "Processo",
  {
    redirecionar: false,
  }
)

export default GerenciarProcessos
