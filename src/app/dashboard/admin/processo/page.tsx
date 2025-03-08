import CrudAvancado from "@/components/CrudAvancado"

export default function GerenciarProcessos() {
  return (
    <CrudAvancado
      tableName="Processo"
      entityName="Processo"
      fields={[
        { key: "numero", label: "Número", type: "text", required: true },
        {
          key: "dataCriacao",
          label: "Data de Criação",
          type: "date",
          required: true,
        },
        { key: "requerente", label: "Requerente", type: "text" },
        {
          key: "responsavelId",
          label: "Responsável",
          type: "select",
          referenceTable: "Responsavel",
        },
        {
          key: "situacaoId",
          label: "Situação",
          type: "select",
          referenceTable: "Situacao",
        },
        {
          key: "formaEntradaId",
          label: "Forma de Entrada",
          type: "select",
          referenceTable: "FormaEntrada",
        },
        { key: "anonimo", label: "Anônimo?", type: "boolean" },
      ]}
    />
  )
}
