"use client"

import { useControladores } from "@/hooks/useControladores"

import { FormSkeleton } from "../skeleton/FormSkeleton"
import { FormDropdown } from "./FormDropdown"

interface RequeridoDropdownSectionProps {
  label: string
  name: string
  tooltip?: string
  hasAllOption?: boolean
  defaultValue?: string | number
}

export function RequeridoDropdownSection({
  label,
  name,
  tooltip,
  hasAllOption = false,
  defaultValue,
}: Readonly<RequeridoDropdownSectionProps>) {
  const { data, isLoading } = useControladores({
    page: 1,
    pageSize: 1000, // pode ajustar esse limite conforme necessário
    orderBy: "nome",
    ascending: true,
  })

  const options = [
    ...(hasAllOption ? [{ nome: "Todos", id: "ALL" }] : []),
    ...data.map((controlador) => ({
      nome: controlador.nome,
      id: controlador.id,
    })),
  ]

  if (isLoading) return <FormSkeleton numberOfFields={1} />

  return (
    <FormDropdown
      label={label}
      name={name}
      options={options}
      tooltip={tooltip}
      defaultValue={defaultValue ?? (hasAllOption ? "ALL" : undefined)}
    />
  )
}
