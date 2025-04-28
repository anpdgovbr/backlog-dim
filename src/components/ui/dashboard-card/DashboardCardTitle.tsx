import { type SxProps, Typography, type TypographyProps } from "@mui/material"

interface DashboardCardTitleProps {
  variant?: TypographyProps["variant"]
  children: React.ReactNode
  sx?: SxProps
}

export function DashboardCardTitle({
  variant = "h5",
  children,
  sx,
}: Readonly<DashboardCardTitleProps>) {
  return (
    <Typography gutterBottom variant={variant} component="div" sx={sx}>
      {children}
    </Typography>
  )
}
