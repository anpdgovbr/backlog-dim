"use client"

import ProcessoDataGrid from "@/components/processo/ProcessoDataGrid"
import withPermissao from "@/hoc/withPermissao"

function GerenciarProcessosWP() {
  return <ProcessoDataGrid />
}

const GerenciarProcessos = withPermissao(GerenciarProcessosWP, "Exibir", "Processo", {
  redirecionar: false,
})

export default GerenciarProcessos
