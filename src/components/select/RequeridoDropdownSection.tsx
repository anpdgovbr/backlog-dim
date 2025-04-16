"use client"

import { EnumData } from "@anpd/shared-types"
import { useEffect, useState } from "react"

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
  const [options, setOptions] = useState<{ nome: string; id: number | string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/requeridos`)
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
        console.error(`Erro ao carregar requerido:`, error)
        setOptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [hasAllOption])

  if (loading) return <FormSkeleton numberOfFields={1} />

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
