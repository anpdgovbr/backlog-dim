"use client"

import { Controller, useFormContext, useWatch } from "react-hook-form"

import { useEffect, useState } from "react"

import Autocomplete from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"

import type { CnaeDto } from "@anpdgovbr/shared-types"

import { useCnae } from "@/hooks/useCnae"

export interface CnaeDropdownSectionProps {
  name: string
  label?: string
}

export function CnaeDropdownSection({
  name,
  label = "CNAE",
}: Readonly<CnaeDropdownSectionProps>) {
  const { control } = useFormContext()
  const selectedId = useWatch({ control, name })
  const [searchTerm, setSearchTerm] = useState("")
  const [extraCnae, setExtraCnae] = useState<CnaeDto | null>(null)

  const shouldFetchList = searchTerm.length >= 3

  const {
    data: cnaes,
    isLoading,
    getById,
  } = useCnae({
    search: shouldFetchList ? searchTerm : "",
    page: 1,
    pageSize: 50,
    orderBy: "code",
    ascending: true,
  })

  useEffect(() => {
    async function buscarExtra() {
      if (!selectedId) {
        if (extraCnae !== null) setExtraCnae(null)
        return
      }

      const existsInOptions = cnaes.some((c) => c.id === selectedId)
      const existsInExtra = extraCnae?.id === selectedId

      if (existsInOptions || existsInExtra) return

      const result = await getById(selectedId)
      if (result && result.id !== extraCnae?.id) {
        setExtraCnae(result)
      }
    }

    buscarExtra()
    // ⚡ Dependendo só do selectedId e extraCnae agora, sem perigo de ciclo!
  }, [selectedId, extraCnae, cnaes, getById])

  const options = shouldFetchList
    ? extraCnae
      ? [...cnaes, extraCnae]
      : cnaes
    : extraCnae
      ? [extraCnae]
      : []

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          options={options}
          loading={isLoading}
          value={options.length > 0 ? options.find((c) => c.id === value) || null : null}
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
