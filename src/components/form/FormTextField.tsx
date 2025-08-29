"use client"

import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"

import type { TextFieldProps } from "@mui/material/TextField"
import TextField from "@mui/material/TextField"

export interface FormTextFieldProps<
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
