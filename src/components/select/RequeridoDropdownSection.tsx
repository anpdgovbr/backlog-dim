"use client"

import { Controller, useFormContext, useWatch } from "react-hook-form"

import { useEffect, useState } from "react"

import Autocomplete from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"

import { useControladores } from "@/hooks/useControladores"

export interface RequeridoDropdownSectionProps {
  label: string
  name: string
  hasAllOption?: boolean
}

export function RequeridoDropdownSection({
  label,
  name,
  hasAllOption = false,
}: Readonly<RequeridoDropdownSectionProps>) {
  const { control } = useFormContext()
  const selectedId = useWatch({ control, name })
  const [searchTerm, setSearchTerm] = useState("")
  const [extraRequerido, setExtraRequerido] = useState<{
    id: number | string
    nome: string
  } | null>(null)

  const shouldFetchList = searchTerm.length >= 3

  const {
    data: controladores,
    isLoading,
    getById,
  } = useControladores({
    search: shouldFetchList ? searchTerm : "",
    page: 1,
    pageSize: 50,
    orderBy: "nome",
    ascending: true,
  })

  useEffect(() => {
    async function carregarExtra() {
      if (!selectedId) {
        setExtraRequerido(null)
        return
      }

      const existe = controladores.some((c) => c.id === selectedId)
      if (existe) {
        setExtraRequerido(null)
        return
      }

      const result = await getById(Number(selectedId))
      if (result) {
        setExtraRequerido({ id: result.id, nome: result.nome })
      }
    }

    carregarExtra()
  }, [selectedId, controladores, getById])

  const options = shouldFetchList
    ? hasAllOption
      ? [{ id: "ALL", nome: "Todos" }, ...controladores]
      : [...controladores]
    : extraRequerido
      ? hasAllOption
        ? [{ id: "ALL", nome: "Todos" }, extraRequerido]
        : [extraRequerido]
      : hasAllOption
        ? [{ id: "ALL", nome: "Todos" }]
        : []

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          options={options}
          loading={isLoading}
          value={options.find((c) => c.id === value) || null}
          onChange={(_, newValue) => onChange(newValue?.id ?? null)}
          onInputChange={(_, inputValue) => setSearchTerm(inputValue)}
          getOptionLabel={(option) => option.nome}
          isOptionEqualToValue={(option, val) => option.id === val?.id}
          noOptionsText="Nenhum resultado"
          loadingText="Buscando Requeridos..."
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
                    {isLoading ? <CircularProgress color="inherit" size={18} /> : null}
                    {params.InputProps?.endAdornment}
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
