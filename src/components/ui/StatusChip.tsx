"use client"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import InfoIcon from "@mui/icons-material/Info"
import WarningIcon from "@mui/icons-material/Warning"
import Chip from "@mui/material/Chip"
import type { ChipProps } from "@mui/material/Chip"

export type StatusType = "success" | "error" | "warning" | "info" | "pending" | "default"

export interface StatusChipProps extends Omit<ChipProps, "color"> {
  status: StatusType
  text?: string
  showIcon?: boolean
}

const statusConfig = {
  success: {
    color: "success" as const,
    icon: <CheckCircleIcon />,
    bgColor: "success.main",
    textColor: "success.contrastText",
  },
  error: {
    color: "error" as const,
    icon: <ErrorIcon />,
    bgColor: "error.main",
    textColor: "error.contrastText",
  },
  warning: {
    color: "warning" as const,
    icon: <WarningIcon />,
    bgColor: "warning.main",
    textColor: "warning.contrastText",
  },
  info: {
    color: "info" as const,
    icon: <InfoIcon />,
    bgColor: "info.main",
    textColor: "info.contrastText",
  },
  pending: {
    color: "default" as const,
    icon: <HourglassEmptyIcon />,
    bgColor: "grey.600",
    textColor: "common.white",
  },
  default: {
    color: "default" as const,
    icon: undefined,
    bgColor: "grey.300",
    textColor: "text.primary",
  },
}

export default function StatusChip({
  status,
  text,
  showIcon = true,
  sx,
  ...props
}: StatusChipProps) {
  const config = statusConfig[status]

  return (
    <Chip
      {...props}
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      label={text || props.label}
      sx={{
        bgcolor: config.bgColor,
        color: config.textColor,
        fontWeight: 600,
        "& .MuiChip-icon": {
          color: config.textColor,
        },
        ...sx,
      }}
    />
  )
}
