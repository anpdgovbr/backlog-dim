"use client"

import React from "react"

import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

export interface ModernModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: () => void
  title: string
  children?: React.ReactNode
  confirmText?: string
  cancelText?: string
  loading?: boolean
  disabled?: boolean
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
  showActions?: boolean
}

export default function ModernModal({
  open,
  onClose,
  onSubmit,
  title,
  children,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  disabled = false,
  maxWidth = "sm",
  showActions = true,
}: ModernModalProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="modern-modal-title"
      fullWidth
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            position: "relative",
          },
        },
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }}
    >
      {/* Header com botão de fechar */}
      <DialogTitle
        id="modern-modal-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          pr: 1,
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <IconButton
          onClick={onClose}
          disabled={loading}
          aria-label="Fechar"
          sx={{
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Conteúdo */}
      <DialogContent sx={{ pt: 1 }}>{children}</DialogContent>

      {/* Ações */}
      {showActions && (
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <GovBRButton
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{
                flex: 1,
                borderColor: "text.secondary",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "text.primary",
                  color: "text.primary",
                },
              }}
            >
              {cancelText}
            </GovBRButton>

            {onSubmit && (
              <GovBRButton
                variant="contained"
                onClick={onSubmit}
                disabled={loading || disabled}
                startIcon={loading ? undefined : <CheckIcon />}
                sx={{
                  flex: 1,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                {loading ? "Processando..." : confirmText}
              </GovBRButton>
            )}
          </Stack>
        </DialogActions>
      )}
    </Dialog>
  )
}

// Componente específico para inputs simples
export function InputModal({
  open,
  onClose,
  onSubmit,
  title,
  label,
  value,
  onChange,
  confirmText = "Salvar",
  cancelText = "Cancelar",
  loading = false,
  placeholder = "",
  autoFocus = true,
}: {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  title: string
  label: string
  value: string
  onChange: (value: string) => void
  confirmText?: string
  cancelText?: string
  loading?: boolean
  placeholder?: string
  autoFocus?: boolean
}) {
  return (
    <ModernModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
      loading={loading}
      disabled={!value.trim()}
      maxWidth="sm"
    >
      <TextField
        autoFocus={autoFocus}
        fullWidth
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        sx={{
          mt: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    </ModernModal>
  )
}
