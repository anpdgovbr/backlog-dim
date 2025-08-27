import React from "react"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { SxProps } from "@mui/material/styles"

import { DashboardCard } from "./DashboardCard"

export interface BaseDashboardCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  action?: () => void
  actionButton?: React.ReactNode
  color?: "primary" | "secondary" | "accent" | "info" | "success" | "warning"
  children?: React.ReactNode
  /** permite sobrepor estilos do card (ex: ajustar cor de fundo/texto) */
  sx?: SxProps
  /** força cor do texto independente do token de contraste da cor */
  textColorOverride?: string
}

export function BaseDashboardCard({
  icon,
  title,
  subtitle,
  description,
  action,
  actionButton,
  color = "primary",
  children,
  sx,
  textColorOverride,
}: Readonly<BaseDashboardCardProps>) {
  const bgColor = `${color}.main`
  const textColor = textColorOverride ?? `${color}.contrastText`

  return (
    <DashboardCard
      hasAction={!!action}
      action={action}
      sx={{
        bgcolor: bgColor,
        /* overlay escuro por cima da cor principal para reduzir saturação e melhorar contraste */
        backgroundImage: "linear-gradient(rgba(0,0,0,0.24), rgba(0,0,0,0.24))",
        color: textColor,
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon, {
                ...(icon.props as Record<string, unknown>),
                sx: {
                  ...((icon.props as Record<string, unknown>)["sx"] as Record<
                    string,
                    unknown
                  >),
                  fontSize: 48,
                  color: textColor,
                  /* reduzir um pouco a opacidade do ícone para suavizar a saturação */
                  opacity: 0.75,
                },
              } as Record<string, unknown>)
            : icon}
          <Box>
            <DashboardCard.Title sx={{ color: textColor }}>{title}</DashboardCard.Title>
            <Typography variant="caption" sx={{ color: textColor, opacity: 0.85 }}>
              {subtitle}
            </Typography>
          </Box>
        </Stack>
        <DashboardCard.Description
          variant="body2"
          sx={{ color: textColor, opacity: 0.9, mb: 2 }}
        >
          {description}
        </DashboardCard.Description>
        {children}
      </Box>
      {actionButton && (
        <Box mt={2} width="100%">
          {actionButton}
        </Box>
      )}
      {/* Elemento decorativo */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          /* diminuir a presença do elemento decorativo para não competir com o conteúdo */
          bgcolor: "rgba(255, 255, 255, 0.02)",
          zIndex: 0,
        }}
      />
    </DashboardCard>
  )
}
