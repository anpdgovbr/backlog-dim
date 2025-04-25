"use client"

import type { CnaeDto } from "@anpd/shared-types"
import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"

interface CnaeDropdownSectionProps {
  name: string
  label?: string
}

export function CnaeDropdownSection({
  name,
  label = "CNAE",
}: Readonly<CnaeDropdownSectionProps>) {
  const { control } = useFormContext()
  const selectedId = useWatch({ control, name }) // observa o valor atual
  const [searchTerm, setSearchTerm] = useState("")
  const [cnaes, setCnaes] = useState<CnaeDto[]>([])
  const [loading, setLoading] = useState(false)

  // 🔁 Busca por nome com debounce
  useEffect(() => {
    if (searchTerm.length < 3) {
      setCnaes([])
      return
    }

    const timeout = setTimeout(() => {
      setLoading(true)
      fetch(`/api/cnaes?search=${encodeURIComponent(searchTerm)}&limit=50`)
        .then((res) => res.json())
        .then((data: CnaeDto[]) => setCnaes(data))
        .catch(() => setCnaes([]))
        .finally(() => setLoading(false))
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  // ✅ Carrega o CNAE selecionado se ainda não estiver na lista
  useEffect(() => {
    if (!selectedId || cnaes.some((c) => c.id === selectedId)) return

    fetch(`/api/cnaes/${selectedId}`)
      .then((res) => res.json())
      .then((data: CnaeDto) => {
        setCnaes((prev) => [...prev, data])
      })
      .catch(() => {})
  }, [selectedId, cnaes])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          options={cnaes}
          loading={loading}
          value={cnaes.find((c) => c.id === value) || null}
          onChange={(_, newValue) => onChange(newValue?.id ?? null)}
          onInputChange={(_, inputValue) => setSearchTerm(inputValue)}
          getOptionLabel={(option) => `${option.code} - ${option.nome}`}
          isOptionEqualToValue={(option, val) => option.id === val?.id}
          noOptionsText="Nenhum resultado"
          loadingText="Buscando CNAEs..."
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
              size="small"
              fullWidth
              error={!!error}
              helperText={error?.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    />
  )
}
