"use client"

import { Box, Modal, SxProps } from "@mui/material"
import { ReactNode } from "react"

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
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") onClose()
      }}
      disableEscapeKeyDown
      aria-labelledby={ariaLabelledBy}
      aria-describedby={`${id}-description`}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }}
    >
      <Box
        className={`br-modal is-${size}`}
        id={id}
        role="dialog"
        aria-modal="true"
        sx={{
          minWidth: 350,
          ...sx,
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          borderRadius: "4px",
          maxHeight: scroll ? 500 : "unset",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--surface-shadow-sm)",
          width: "auto",
        }}
      >
        <div className="br-modal-header">
          <div className="modal-title" id={ariaLabelledBy}>
            {title}
          </div>
          <button
            className="br-button circle small close"
            type="button"
            aria-label="Fechar"
            onClick={onClose}
          >
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>
        <div className="br-modal-body" id={`${id}-description`}>
          {children}
        </div>
        {footer && <div className="br-modal-footer justify-content-end">{footer}</div>}
      </Box>
    </Modal>
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
      <p>{message}</p>
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
          <button className="br-button secondary mr-2" onClick={onClose}>
            {cancelText}
          </button>
          <button className="br-button primary" onClick={onSubmit} disabled={disabled}>
            {confirmText}
          </button>
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
