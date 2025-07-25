"use client"

import { Controller, useFormContext } from "react-hook-form"

import TextField from "@mui/material/TextField"

import { toInputDateValue } from "@/utils/date"

interface FormDateFieldProps {
  name: string
  label: string
}

// Componente de campo de data controlado para usar com react-hook-form e Material-UI.
// Lida com a conversão entre o objeto Date (do form) e a string "yyyy-MM-dd" (do input).

export default function FormDateField({ name, label }: FormDateFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field }) => {
        const formattedValue = toInputDateValue(field.value)

        return (
          <TextField
            label={label}
            type="date"
            fullWidth
            size="small"
            slotProps={{
              inputLabel: { shrink: true }, // Garante que o label fique acima do campo quando preenchido}
            }}
            error={!!errors[name]}
            helperText={errors[name]?.message as string}
            onBlur={field.onBlur}
            ref={field.ref}
            value={formattedValue}
            onChange={(e) => {
              const dateString = e.target.value
              // Se a string existir, cria um objeto Date. Senão, envia null.
              // Adicionar T00:00:00 evita problemas de fuso horário, tratando a data como local.
              const dateObject = dateString ? new Date(`${dateString}T00:00:00`) : null

              // Envia o objeto Date (ou null) para o estado do react-hook-form
              field.onChange(dateObject)
            }}
          />
        )
      }}
    />
  )
}
