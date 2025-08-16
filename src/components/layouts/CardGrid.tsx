"use client"

import React from "react"

import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

interface CardGridProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  spacing?: number
  minCardHeight?: number | string
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export default function CardGrid({
  children,
  title,
  subtitle,
  spacing = 3,
  minCardHeight = "auto",
  columns = { xs: 12, sm: 6, md: 4, lg: 3 },
}: Readonly<CardGridProps>) {
  return (
    <Box>
      {/* Título da seção */}
      {(title || subtitle) && (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {title && (
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      )}

      {/* Grid de Cards */}
      <Grid container spacing={spacing}>
        {React.Children.map(children, (child, index) => (
          <Grid item key={index} {...columns}>
            <Box
              sx={{
                height: "100%",
                minHeight: minCardHeight,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {child}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// Componente para seções de dashboard
export function DashboardSection({
  children,
  title,
  subtitle,
  actions,
  spacing = 4,
}: Readonly<{
  children: React.ReactNode
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  spacing?: number
}>) {
  return (
    <Box sx={{ mb: spacing }}>
      {(title || subtitle || actions) && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            {title && (
              <Typography
                variant="h5"
                component="h2"
                gutterBottom={!!subtitle}
                sx={{ fontWeight: 600 }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box>{actions}</Box>}
        </Stack>
      )}
      {children}
    </Box>
  )
}
