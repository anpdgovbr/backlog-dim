"use client"

import React from "react"

import CloseIcon from "@mui/icons-material/Close"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"

/**
 * Props para `DialogAlert` — caixa de confirmação genérica usada na UI.
 *
 * Exemplo de uso:
 * ```tsx
 * <DialogAlert open={open} onClose={() => setOpen(false)} onConfirm={handleConfirm} />
 * ```
 */
export interface DialogAlertProps
  extends Readonly<{
    open: boolean
    onClose: () => void
    onConfirm?: () => void
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
    severity?: "info" | "warning" | "danger"
  }> {}

/**
 * Diálogo de alerta/confirm ação com botões padrão.
 */
export default function DialogAlert({
  open,
  onClose,
  onConfirm,
  title = "Tem certeza?",
  message = "Essa ação não poderá ser desfeita.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  severity = "warning",
}: DialogAlertProps) {
  const theme = useTheme()

  const severityIcon = {
    info: "fas fa-info-circle",
    warning: "fas fa-exclamation-triangle",
    danger: "fas fa-exclamation-circle",
  }[severity]

  const severityColor = {
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    danger: theme.palette.error.main,
  }[severity]

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          onClose()
        }
      }}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            position: "relative",
            px: 2,
            py: 1,
            textAlign: "center",
          },
        },
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Fechar"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle
        id="dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          fontWeight: "bold",
          color: severityColor,
        }}
      >
        <i className={severityIcon} aria-hidden="true" /> {title}
      </DialogTitle>

      <DialogContent>
        <Typography id="dialog-description" sx={{ mt: 1 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            borderColor: "text.secondary",
            color: "text.secondary",
            "&:hover": {
              borderColor: "text.primary",
              color: "text.primary",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            bgcolor: "error.main",
            color: "error.contrastText",
            "&:hover": {
              bgcolor: "error.dark",
            },
          }}
        >
          {loading ? "Aguarde..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
