"use client"

import { useTheme } from "@mui/material/styles"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

export default function SystemTitle() {
  const theme = useTheme()

  return (
    <Typography
      variant="h4" // maior para dar mais presença no header
      component="div"
      suppressHydrationWarning
      sx={(t) => ({
        color: t.palette.primary.contrastText,
        // garantir que todos os descendentes herdem a mesma cor (evita <a> azul por padrão)
        "&, & *": {
          color: t.palette.primary.contrastText,
        },
        fontWeight: t.typography.fontWeightBold,
        letterSpacing: "0.02em",
        textAlign: "center",
        lineHeight: 1,
        mt: 0,
        mb: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      })}
    >
      <Link
        href="/"
        underline="none"
        suppressHydrationWarning
        sx={(t) => ({
          textDecoration: "none !important",
          color: t.palette.primary.contrastText, // garantir cor legível sobre AppBar
          display: "inline-flex",
          alignItems: "center",
          gap: t.spacing(0.5),
          "&:hover, &:focus, &:active": {
            textDecoration: "none",
            backgroundColor: "transparent !important",
          },
          // garantir que nenhum descendente mostre sublinhado ou fundo (ex.: regras globais)
          "&, & *": {
            textDecoration: "none !important",
            backgroundColor: "transparent !important",
          },
        })}
      >
        <span style={{ display: "inline-block" }}>Processamento Backlog DIM</span>

        <Typography
          variant="caption"
          component="sup"
          suppressHydrationWarning
          sx={{
            fontWeight: theme.typography.fontWeightMedium,
            opacity: 0.85,
            ml: theme.spacing(0.5),
          }}
        >
          Alfa
        </Typography>
      </Link>
    </Typography>
  )
}
