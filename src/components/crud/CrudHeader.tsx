"use client"

import { useTheme } from "@mui/material/styles"

import AddIcon from "@mui/icons-material/Add"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

export interface CrudHeaderProps {
  title: string
  onAdd: () => void
  canAdd: boolean
}

export default function CrudHeader({ title, onAdd, canAdd }: CrudHeaderProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[1],
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: "primary.main",
          fontWeight: theme.typography.fontWeightBold,
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        disabled={!canAdd}
        startIcon={<AddIcon />}
        onClick={onAdd}
        sx={{
          textTransform: "none",
          fontWeight: theme.typography.fontWeightMedium,
          px: 3,
          py: 1,
          borderRadius: 2,
          boxShadow: theme.shadows[2],

          "&:hover": {
            boxShadow: theme.shadows[4],
            transform: "translateY(-1px)",
          },

          "&:disabled": {
            bgcolor: "grey.300",
            color: "grey.600",
          },

          transition: "all 0.2s ease",
        }}
      >
        Adicionar
      </Button>
    </Box>
  )
}
