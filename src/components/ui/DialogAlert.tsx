"use client"

import CloseIcon from "@mui/icons-material/Close"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material"
import React from "react"

interface DialogAlertProps {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  severity?: "info" | "warning" | "danger"
}

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
          className="br-button secondary"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          className="br-button danger"
          onClick={onConfirm}
          disabled={loading}
          sx={{ color: "#fff" }}
        >
          {loading ? "Aguarde..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
