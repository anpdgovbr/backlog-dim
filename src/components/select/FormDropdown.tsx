import { EnumData } from "@/types/EnumData"
import { MenuItem, SelectProps, TextField, TextFieldProps, Tooltip } from "@mui/material"
import { Controller, useFormContext } from "react-hook-form"

type FormDropdown = TextFieldProps & {
  name: string
  label: string
  tooltip?: string
  options: EnumData[]
  defaultValue?: string | number
  menuProps?: Partial<SelectProps>["MenuProps"]
}

export function FormDropdown({
  label,
  tooltip,
  name,
  options = [],
  defaultValue,
  menuProps,
  ...rest
}: FormDropdown) {
  const { control } = useFormContext()

  function renderOptions() {
    return options.map((option) => (
      <MenuItem
        key={option.id}
        value={option.id}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        <Tooltip title={option.nome} placement="right" arrow>
          <span>
            {option.nome.length > 50
              ? `${option.nome.slice(0, 50).trim()}...`
              : option.nome}
          </span>
        </Tooltip>
      </MenuItem>
    ))
  }

  return (
    <Controller
      defaultValue={defaultValue ?? ""}
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Tooltip title={tooltip ?? label} placement="top">
          <TextField
            select
            id={`input-${name}`}
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onChange}
            value={options.length !== 0 ? value : ""}
            label={label}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 1,
              },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxWidth: 400,
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  },
                },
                ...menuProps,
              },
            }}
            {...rest}
          >
            {renderOptions()}
          </TextField>
        </Tooltip>
      )}
    />
  )
}
