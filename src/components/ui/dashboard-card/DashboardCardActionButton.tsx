import ChevronRight from "@mui/icons-material/ChevronRight"
import Button from "@mui/material/Button"
import CardActions from "@mui/material/CardActions"
import type { SxProps } from "@mui/material/styles"

export interface DashboardCardActionButtonProps {
  id?: string
  title: string
  hasIcon?: boolean
  variant?: "text" | "outlined" | "contained"
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  sx?: SxProps
  children?: React.ReactNode
}

export function DashboardCardActionButton({
  id,
  title,
  hasIcon = false,
  variant = "outlined",
  onClick = () => {},
  disabled = false,
  fullWidth = false,
  sx,
  children,
}: Readonly<DashboardCardActionButtonProps>) {
  return (
    <CardActions
      sx={{
        fontSize: "0.8rem",
        padding: 0,
        paddingTop: 2,
        marginTop: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        ...sx,
      }}
    >
      <Button
        component="div"
        size="small"
        variant={variant}
        color="inherit"
        fullWidth={fullWidth}
        endIcon={hasIcon && <ChevronRight />}
        onClick={onClick}
        disabled={disabled}
        sx={{ fontSize: "inherit" }}
        id={id}
      >
        {children}
        {title}
      </Button>
    </CardActions>
  )
}
