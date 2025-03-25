import RequeridoDataGrid from "@/components/requerido/RequeridoDataGrid"
import withPermissao from "@/hoc/withPermissao"

function GerenciarRequeridosContent() {
  return <RequeridoDataGrid />
}

const GerenciarRequeridos = withPermissao(
  GerenciarRequeridosContent,
  "Exibir",
  "Responsavel",
  {
    redirecionar: false,
  }
)

export default GerenciarRequeridos
