"use client"

import { useTheme } from "@mui/material/styles"

import { GovBRButton } from "@anpdgovbr/shared-ui"
import AddIcon from "@mui/icons-material/Add"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

// Substitui a interface por um type que aplica Readonly<> conforme convenção do projeto
export type CrudHeaderProps = Readonly<{
  title: string
  onAdd: () => void
  canAdd: boolean
}>

// Ajusta a assinatura do componente para aceitar props imutáveis e desestrutura internamente
export default function CrudHeader(props: CrudHeaderProps) {
  const { title, onAdd, canAdd } = props
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center", // centraliza verticalmente os filhos
        p: 2,
        minHeight: 56, // garante espaço suficiente para centralização consistente
        gap: 2, // espaçamento consistente entre itens quando necessário
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[1],
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Typography
        variant="h6"
        component="h4"
        sx={{
          color: "primary.main",
        }}
      >
        {title}
      </Typography>

      <GovBRButton
        variant="contained"
        color="primary"
        disabled={!canAdd}
        startIcon={<AddIcon />}
        onClick={onAdd}
      >
        Adicionar
      </GovBRButton>
    </Box>
  )
}
