"use client"

import { useTheme } from "@mui/material/styles"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { GovBRButton } from "@anpdgovbr/shared-ui"

export interface Item {
  id?: number
  nome: string
}

export type CrudModalProps = Readonly<{
  open: boolean
  onClose: () => void
  onSave: () => void
  item: Partial<Item>
  onItemChange: (updates: Partial<Item>) => void
  title: string
}>

export default function CrudModal({
  open,
  onClose,
  onSave,
  item,
  onItemChange,
  title,
}: CrudModalProps) {
  const theme = useTheme()
  const isEdit = !!item.id
  const canSave = item.nome?.trim()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "8px",
            boxShadow: theme.shadows[8],
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 2,
          mt: "0 !important",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 3,
          pb: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {isEdit
              ? "Edite as informações do item abaixo:"
              : "Preencha as informações do novo item:"}
          </Typography>

          <TextField
            autoFocus
            fullWidth
            label="Nome"
            value={item.nome || ""}
            onChange={(e) => onItemChange({ nome: e.target.value })}
            variant="outlined"
            required
            helperText="Campo obrigatório"
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
          bgcolor: "grey.25",
        }}
      >
        <GovBRButton onClick={onClose} variant="outlined" color="error">
          Cancelar
        </GovBRButton>

        <GovBRButton
          onClick={onSave}
          variant="contained"
          color="primary"
          disabled={!canSave}
        >
          {isEdit ? "Salvar" : "Criar"}
        </GovBRButton>
      </DialogActions>
    </Dialog>
  )
}
