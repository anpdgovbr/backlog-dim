import { Controller, useFormContext } from "react-hook-form"

import type { SelectChangeEvent } from "@mui/material"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Tooltip from "@mui/material/Tooltip"

import type { EnumData } from "@anpdgovbr/shared-types"

export interface FormDropdownProps {
  name: string
  label: string
  options: EnumData[]
  defaultValue?: string | number
  placeholder?: string
}

export function FormDropdown({
  name,
  label,
  options,
  defaultValue,
  placeholder,
}: FormDropdownProps) {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? ""}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl fullWidth size="small" error={!!error}>
          <InputLabel id={`${name}-label`} shrink>
            {label}
          </InputLabel>
          <Select
            labelId={`${name}-label`}
            id={`select-${name}`}
            value={value ?? ""}
            label={label}
            onChange={onChange as (event: SelectChangeEvent<unknown>) => void}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <span style={{ color: "#888" }}>{placeholder ?? "Selecione..."}</span>
                )
              }
              const selectedOption = options.find((o) => o.id === selected)
              return selectedOption?.nome || ""
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxWidth: 400,
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                },
              },
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                <Tooltip title={option.nome} placement="right" arrow>
                  <span>
                    {option.nome.length > 50
                      ? `${option.nome.slice(0, 50)}...`
                      : option.nome}
                  </span>
                </Tooltip>
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  )
}
