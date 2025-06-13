"use client"

import type { TextFieldProps } from "@mui/material"
import { TextField } from "@mui/material"
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"

interface FormTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Omit<TextFieldProps, "name"> {
  name: TName
  control: ControllerProps<TFieldValues, TName>["control"]
}

export function FormTextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ name, control, ...textFieldProps }: FormTextFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...textFieldProps}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  )
}
