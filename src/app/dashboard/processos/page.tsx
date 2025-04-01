"use client"

import ProcessoDataGrid from "@/components/processo/ProcessoDataGrid"
import withPermissao from "@/hoc/withPermissao"

const ListarProcessos = withPermissao(ProcessoDataGrid, "Exibir", "Processo", {
  redirecionar: false,
})

export default ListarProcessos
