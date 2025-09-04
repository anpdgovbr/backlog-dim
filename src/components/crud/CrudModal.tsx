"use client"

import { useTheme } from "@mui/material/styles"

import Box from "@mui/material/Box"
import Dialog, { type DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle, { type DialogTitleProps } from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import Typography, { type TypographyProps } from "@mui/material/Typography"
import { GovBRButton } from "@anpdgovbr/shared-ui"

export interface CrudModalItem {
  id?: number
  nome: string
}

export type CrudModalMyTitleProps = {
  sxDialogTitle?: DialogTitleProps["sx"]
  title?: string
  sxTypography?: TypographyProps["sx"]
}

export type CrudModalProps = Readonly<{
  open: boolean
  onClose: () => void
  onSave: () => void
  item: Partial<CrudModalItem>
  onItemChange: (updates: Partial<CrudModalItem>) => void
  title: string
  fullWidth?: boolean
  sxDialog?: DialogProps
  sxTitle?: CrudModalMyTitleProps
}>

export default function CrudModal({
  open,
  onClose,
  onSave,
  item,
  onItemChange,
  title,
  fullWidth = false,
  sxDialog,
  sxTitle,
}: CrudModalProps) {
  const theme = useTheme()
  const isEdit = !!item.id
  const canSave = item.nome?.trim()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={fullWidth}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "8px",
            boxShadow: theme.shadows[8],
          },
        },
      }}
      {...sxDialog}
    >
      <DialogTitle
        {...sxTitle}
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
