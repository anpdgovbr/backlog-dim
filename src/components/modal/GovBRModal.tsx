"use client"

import type { ReactNode } from "react"

import CloseIcon from "@mui/icons-material/Close"
import type { SxProps } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { GovBRButton } from "@anpdgovbr/shared-ui"

interface GovBRModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: "xsmall" | "small" | "medium" | "large" | "auto"
  scroll?: boolean
  id?: string
  ariaLabelledBy?: string
  sx?: SxProps
}

export function GovBRModal({
  open,
  onClose,
  title = "Título",
  children,
  footer,
  size = "medium",
  scroll = true,
  id = "govbr-modal",
  ariaLabelledBy = "govbr-modal-title",
  sx,
}: GovBRModalProps) {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") onClose()
      }}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={`${id}-description`}
      scroll={scroll ? "paper" : "body"}
      PaperComponent={(props) => (
        <Paper
          {...props}
          className={`br-modal is-${size}`}
          id={id}
          role="dialog"
          aria-modal="true"
          sx={{
            width: "auto",
            minWidth: 350,
            borderRadius: 1,
            maxHeight: scroll ? 600 : "unset",
            display: "flex",
            flexDirection: "column",
            boxShadow: "var(--surface-shadow-sm)",
            ...sx,
          }}
        />
      )}
      slotProps={{
        backdrop: {
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        },
      }}
    >
      <DialogTitle
        id={ariaLabelledBy}
        className="br-modal-header"
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h6" component="div" className="modal-title">
          {title}
        </Typography>
        <IconButton
          aria-label="Fechar"
          onClick={onClose}
          size="small"
          className="br-button circle small close"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </DialogTitle>

      <DialogContent id={`${id}-description`} className="br-modal-body" sx={{ m: 0 }}>
        {children}
      </DialogContent>

      {footer && (
        <DialogActions className="br-modal-footer justify-content-end" sx={{ gap: 1 }}>
          {footer}
        </DialogActions>
      )}
    </Dialog>
  )
}
export function GovBRConfirmModal({
  open,
  onClose,
  onConfirm,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  title = "Confirmação",
  sx,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
  confirmText?: string
  cancelText?: string
  title?: string
  sx?: SxProps
}) {
  return (
    <GovBRModal
      open={open}
      onClose={onClose}
      title={title}
      sx={sx}
      footer={
        <>
          <button className="br-button secondary mr-2" onClick={onClose}>
            {cancelText}
          </button>
          <button className="br-button primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </>
      }
    >
      <Typography>{message}</Typography>
    </GovBRModal>
  )
}

export function GovBRInputModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  confirmText = "Salvar",
  cancelText = "Cancelar",
  disabled = false,
  sx,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSubmit: () => void
  confirmText?: string
  cancelText?: string
  disabled?: boolean
  sx?: SxProps
}) {
  return (
    <GovBRModal
      open={open}
      onClose={onClose}
      title={title}
      sx={sx}
      footer={
        <>
          <GovBRButton
            className="br-button secondary mr-2"
            variant="contained"
            onClick={onClose}
          >
            {cancelText}
          </GovBRButton>
          <GovBRButton
            type="submit"
            variant="contained"
            className="br-button primary"
            onClick={onSubmit}
            disabled={disabled}
          >
            {confirmText}
          </GovBRButton>
        </>
      }
    >
      {children}
    </GovBRModal>
  )
}

export function GovBROptionModal({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  disabled = false,
  sx,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  disabled?: boolean
  sx?: SxProps
}) {
  return (
    <GovBRModal
      open={open}
      onClose={onClose}
      title={title}
      sx={sx}
      footer={
        <>
          <button className="br-button secondary mr-2" onClick={onClose}>
            {cancelText}
          </button>
          <button className="br-button primary" onClick={onConfirm} disabled={disabled}>
            {confirmText}
          </button>
        </>
      }
    >
      {children}
    </GovBRModal>
  )
}
