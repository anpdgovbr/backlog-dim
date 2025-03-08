import CrudAvancado from "@/components/CrudAvancado"

export default function GerenciarRequeridos() {
  return (
    <CrudAvancado
      tableName="Requerido"
      entityName="Requerido"
      fields={[
        { key: "nome", label: "Nome", type: "text", required: true },
        { key: "cnpj", label: "CNPJ", type: "text" },
        {
          key: "setorId",
          label: "Setor",
          type: "select",
          referenceTable: "Setor",
        },
      ]}
    />
  )
}
