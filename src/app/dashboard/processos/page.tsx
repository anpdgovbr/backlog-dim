"use client"

import ProcessoDataGrid from "@/components/processo/ProcessoDataGrid"
import { DashboardLayout } from "@/components/layouts"
import withPermissao from "@/hoc/withPermissao"

function ListarProcessosPage() {
  return (
    <DashboardLayout
      title="Listar Processos"
      subtitle="Gerencie e visualize os processos"
    >
      <ProcessoDataGrid showTitle={false} />
    </DashboardLayout>
  )
}

export default withPermissao(ListarProcessosPage, "Exibir", "Processo", {
  redirecionar: false,
})
