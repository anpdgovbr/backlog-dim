import type { SxProps } from "@mui/material"
import { Box } from "@mui/material"

interface DashboardCardContentProps {
  children: React.ReactNode
  sx?: SxProps
}

export function DashboardCardContent({
  children,
  sx,
}: Readonly<DashboardCardContentProps>) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}
