"use client"

import type { DialogProps, SxProps, Theme } from "@mui/material"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import type { ReactNode } from "react"

interface GenericFormDialogProps extends Omit<DialogProps, "children" | "title"> {
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
  title,
  children,
  actions,
  showDefaultActions = true,
  maxWidth = "md",
  fullWidth = true,
  scroll = "paper",
  contentSx,
  paperSx,
  ...rest
}: GenericFormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll={scroll}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            ...paperSx,
          },
        },
      }}
      {...rest}
    >
      {title && (
        <DialogTitle component={"h1"} variant="h4">
          {title}
        </DialogTitle>
      )}

      <DialogContent
        dividers
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          ...contentSx,
        }}
      >
        {children}
      </DialogContent>

      {(actions || showDefaultActions) && (
        <DialogActions>
          {actions}
          {showDefaultActions && (
            <Box flex={1} display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={onClose} color="inherit">
                Fechar
              </Button>
              {onSubmit && (
                <Button onClick={onSubmit} variant="contained">
                  Salvar
                </Button>
              )}
            </Box>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}
