"use client"

import type { ReactNode } from "react"

import CloseIcon from "@mui/icons-material/Close"
import type { DialogProps, SxProps, Theme } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { GovBRButton } from "@anpdgovbr/shared-ui"

export interface GenericFormDialogProps extends Omit<DialogProps, "children" | "title"> {
  open: boolean
  onClose: () => void
  onSubmit?: () => void
  title?: ReactNode
  children: ReactNode
  actions?: ReactNode
  showDefaultActions?: boolean
  maxWidth?: DialogProps["maxWidth"]
  fullWidth?: boolean
  scroll?: DialogProps["scroll"]
  contentSx?: SxProps<Theme>
  paperSx?: SxProps<Theme>
}

export default function GenericFormDialog({
  open,
  onClose,
  onSubmit,
  title = "Título",
  children,
  actions,
  showDefaultActions = true,

  fullWidth = true,
  scroll = "paper",
  contentSx,
  paperSx,
  ...rest
}: GenericFormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") onClose()
      }}
      scroll={scroll}
      fullWidth={fullWidth}
      aria-labelledby="generic-form-dialog-title"
      slotProps={{
        paper: {
          component: Paper,
          className: `br-modal `,
          sx: {
            width: "auto",
            minWidth: 350,

            borderRadius: 1,
            maxHeight: scroll === "paper" ? 600 : "unset",
            display: "flex",
            flexDirection: "column",
            boxShadow: "var(--surface-shadow-sm)",
            ...paperSx,
          },
        },
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }}
      {...rest}
    >
      <DialogTitle
        id="generic-form-dialog-title"
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

      <DialogContent className="br-modal-body" sx={{ px: 3, py: 2, ...contentSx }}>
        {children}
      </DialogContent>

      {(actions || showDefaultActions) && (
        <DialogActions
          className="br-modal-footer justify-content-end"
          sx={{ gap: 1, px: 3, py: 2 }}
        >
          {actions}
          {showDefaultActions && (
            <>
              <GovBRButton className="br-button secondary mr-2" onClick={onClose}>
                Fechar
              </GovBRButton>
              {onSubmit && (
                <GovBRButton className="br-button primary" onClick={onSubmit}>
                  Salvar
                </GovBRButton>
              )}
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}
