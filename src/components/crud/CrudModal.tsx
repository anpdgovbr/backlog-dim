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

export interface Item {
  id?: number
  nome: string
}

export interface CrudModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  item: Partial<Item>
  onItemChange: (updates: Partial<Item>) => void
  title: string
}

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
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 2,

          "& .MuiTypography-root": {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: theme.typography.h6.fontSize,
          },
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
            size="medium"
            required
            helperText="Campo obrigatório"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: "2px",
                },
              },
            }}
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
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            color: "text.secondary",
            borderColor: "divider",

            "&:hover": {
              bgcolor: "grey.100",
              borderColor: "grey.400",
            },
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={onSave}
          variant="contained"
          color="primary"
          disabled={!canSave}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            fontWeight: theme.typography.fontWeightMedium,
            boxShadow: theme.shadows[2],

            "&:hover": {
              boxShadow: theme.shadows[4],
              transform: "translateY(-1px)",
            },

            "&:disabled": {
              bgcolor: "grey.300",
              color: "grey.600",
              boxShadow: "none",
            },

            transition: "all 0.2s ease",
          }}
        >
          {isEdit ? "Salvar" : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
