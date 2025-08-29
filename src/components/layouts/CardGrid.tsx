"use client"

import * as React from "react"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

export interface CardGridProps {
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
      <Box
        sx={{
          display: "grid",
          gap: spacing,
          alignItems: "stretch", // stretch para que itens da mesma linha tenham mesma altura
          gridTemplateColumns: {
            xs: `repeat(${12 / (columns.xs || 12)}, minmax(280px, 1fr))`,
            sm: columns.sm ? `repeat(auto-fit, minmax(300px, 1fr))` : undefined,
            md: columns.md ? `repeat(auto-fit, minmax(320px, 1fr))` : undefined,
            lg: columns.lg ? `repeat(auto-fit, minmax(280px, 1fr))` : undefined,
            xl: columns.xl ? `repeat(auto-fit, minmax(280px, 1fr))` : undefined,
          },
        }}
      >
        {React.Children.toArray(children).map((child, index) => {
          const key =
            React.isValidElement(child) && child.key ? child.key : `grid-child-${index}`
          return (
            <Box
              key={key}
              sx={{
                height: "100%", // garante que o item do grid ocupe toda a altura da linha
              }}
            >
              {/* inner wrapper com flex:1 para que o conteúdo interno cresça e preencha a altura */}
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minHeight: minCardHeight,
                }}
              >
                {child}
              </Box>
            </Box>
          )
        })}
      </Box>
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
