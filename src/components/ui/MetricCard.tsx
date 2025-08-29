"use client"

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { SxProps } from "@mui/material/styles"

export interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label?: string
  }
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info"
  sx?: SxProps
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "primary",
  sx,
}: MetricCardProps) {
  const getTrendColor = () => {
    if (!trend) return "text.secondary"
    return trend.value > 0
      ? "success.main"
      : trend.value < 0
        ? "error.main"
        : "text.secondary"
  }

  const getTrendIcon = () => {
    if (!trend || trend.value === 0) return null
    return trend.value > 0 ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    )
  }

  return (
    <Card
      sx={{
        bgcolor: `${color}.main`,
        color: `${color}.contrastText`,
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      {/* Elemento decorativo */}
      <Box
        sx={{
          position: "absolute",
          top: -10,
          right: -10,
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.05)",
          zIndex: 0,
        }}
      />

      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: `${color}.contrastText`,
                opacity: 0.8,
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
          </Box>
          {icon && (
            <Box sx={{ color: `${color}.contrastText`, opacity: 0.7 }}>{icon}</Box>
          )}
        </Stack>

        <Typography
          variant="h4"
          component="div"
          sx={{
            color: `${color}.contrastText`,
            fontWeight: 700,
            mb: 1,
          }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: `${color}.contrastText`,
                opacity: 0.7,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {trend && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ color: getTrendColor(), display: "flex" }}>{getTrendIcon()}</Box>
              <Typography
                variant="caption"
                sx={{
                  color: getTrendColor(),
                  fontWeight: 600,
                }}
              >
                {Math.abs(trend.value)}%{trend.label && ` ${trend.label}`}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
