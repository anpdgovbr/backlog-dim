"use client"

import { useSetor } from "@/hooks/useSetor"

import { FormSkeleton } from "../skeleton/FormSkeleton"
import { FormDropdown } from "./FormDropdown"

export interface SetorDropdownSectionProps {
  label: string
  name: string
  hasAllOption?: boolean
  defaultValue?: string | number
  placeholder?: string
}

export function SetorDropdownSection({
  label,
  name,

  hasAllOption = false,
  defaultValue,
  placeholder,
}: Readonly<SetorDropdownSectionProps>) {
  const { data, isLoading } = useSetor({
    page: 1,
    pageSize: 50,
    orderBy: "nome",
    ascending: true,
  })

  const options = [
    ...(hasAllOption ? [{ nome: "Todos", id: "ALL" }] : []),
    ...data.map((setor) => ({
      nome: setor.nome,
      id: setor.id,
    })),
  ]

  if (isLoading) return <FormSkeleton numberOfFields={1} />

  return (
    <FormDropdown
      label={label}
      name={name}
      options={options}
      placeholder={placeholder}
      defaultValue={defaultValue ?? (hasAllOption ? "ALL" : undefined)}
    />
  )
}
