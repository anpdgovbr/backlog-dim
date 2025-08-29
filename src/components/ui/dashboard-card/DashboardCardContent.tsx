import Box from "@mui/material/Box"
import type { SxProps } from "@mui/material/styles"

export interface DashboardCardContentProps {
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
