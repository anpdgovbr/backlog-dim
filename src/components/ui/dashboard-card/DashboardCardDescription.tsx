import { Typography } from "@mui/material"
import type { TypographyProps } from "@mui/material"

interface DashboardCardDescriptionProps {
  variant?: TypographyProps["variant"]
  children: React.ReactNode
}
export function DashboardCardDescription({
  variant = "body2",
  children,
}: Readonly<DashboardCardDescriptionProps>) {
  return <Typography variant={variant}>{children}</Typography>
}
