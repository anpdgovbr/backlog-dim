import Typography, { type TypographyProps } from "@mui/material/Typography"

interface DashboardCardDescriptionProps extends TypographyProps {
  children: React.ReactNode
}

export function DashboardCardDescription({
  variant = "body2",
  children,
  ...props
}: Readonly<DashboardCardDescriptionProps>) {
  return (
    <Typography variant={variant} {...props}>
      {children}
    </Typography>
  )
}
