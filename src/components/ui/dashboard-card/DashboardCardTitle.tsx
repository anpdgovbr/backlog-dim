import type { SxProps } from "@mui/material"
import Typography, { type TypographyProps } from "@mui/material/Typography"

export interface DashboardCardTitleProps {
  variant?: TypographyProps["variant"]
  children: React.ReactNode
  sx?: SxProps
}

export function DashboardCardTitle({
  variant = "h4",
  children,
  sx,
}: Readonly<DashboardCardTitleProps>) {
  return (
    <Typography gutterBottom variant={variant} component="div" sx={sx}>
      {children}
    </Typography>
  )
}
