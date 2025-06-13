"use client"

import type { MetaEntidade } from "@/types/MetaEntidades"
import type { EnumData } from "@anpd/shared-types"
import { useEffect, useState } from "react"

import { FormSkeleton } from "../skeleton/FormSkeleton"
import { FormDropdown } from "./FormDropdown"

interface MetaDropdownSectionProps {
  entidade: MetaEntidade
  label: string
  name: string
  tooltip?: string
  hasAllOption?: boolean
  defaultValue?: string | number
}

export function MetaDropdownSection({
  entidade,
  label,
  name,
  hasAllOption = false,
  defaultValue,
}: Readonly<MetaDropdownSectionProps>) {
  const [options, setOptions] = useState<{ nome: string; id: number | string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/meta/${entidade}?pageSize=1000`)
        const json = await res.json()
        const data: EnumData[] = json.data ?? []

        const parsed = data.map((item) => ({
          nome: item.nome,
          id: item.id,
        }))

        if (hasAllOption) {
          setOptions([{ nome: "Todos", id: "ALL" }, ...parsed])
        } else {
          setOptions(parsed)
        }
      } catch (error) {
        console.error(`Erro ao carregar ${entidade}:`, error)
        setOptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [entidade, hasAllOption])

  if (loading) return <FormSkeleton numberOfFields={1} />

  return (
    <FormDropdown
      label={label}
      name={name}
      options={options}
      defaultValue={defaultValue ?? (hasAllOption ? "ALL" : undefined)}
    />
  )
}
