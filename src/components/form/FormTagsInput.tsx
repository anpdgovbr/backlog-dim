"use client"

import { Box, Chip, TextField } from "@mui/material"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

interface FormTagsInputProps {
  name: string
  label: string
}

export default function FormTagsInput({ name, label }: FormTagsInputProps) {
  const { control } = useFormContext()
  const [inputValue, setInputValue] = useState("")

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        const tags = field.value ?? []

        const handleAddTag = () => {
          const newTag = inputValue.trim()
          if (newTag && !tags.includes(newTag)) {
            field.onChange([...tags, newTag])
          }
          setInputValue("")
        }

        const handleDelete = (index: number) => {
          field.onChange(tags.filter((_: string, i: number) => i !== index))
        }

        return (
          <>
            <TextField
              label={label}
              size="small"
              fullWidth
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tags.map((tag: string, index: number) => (
                <Chip key={index} label={tag} onDelete={() => handleDelete(index)} />
              ))}
            </Box>
          </>
        )
      }}
    />
  )
}
