import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import { styled } from "@mui/material/styles"
import type { SxProps } from "@mui/material/styles"

import { DashboardCardActionButton } from "./DashboardCardActionButton"
import { DashboardCardContent } from "./DashboardCardContent"
import { DashboardCardDescription } from "./DashboardCardDescription"
import { DashboardCardMedia } from "./DashboardCardMedia"
import { DashboardCardTitle } from "./DashboardCardTitle"

interface DashboardCardProps {
  hasAction?: boolean
  action?: () => void
  children: React.ReactNode
  sx?: SxProps
  id?: string
}
const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  minWidth: 0,
})

export function DashboardCard({
  hasAction = false,
  action = () => {},
  children,
  sx,
  id,
}: Readonly<DashboardCardProps>) {
  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        cursor: hasAction ? "pointer" : "default",
        transition: "all 0.3s ease",
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        "&:hover": {
          boxShadow: hasAction
            ? "0px 8px 24px rgba(0, 0, 0, 0.18)"
            : "0px 6px 20px rgba(0, 0, 0, 0.15)",
          transform: hasAction ? "translateY(-2px)" : "translateY(-1px)",
        },
        ...sx,
      }}
    >
      {hasAction ? (
        <CardActionArea onClick={action} sx={{ height: "100%" }} id={id}>
          <StyledCardContent sx={sx}>{children}</StyledCardContent>
        </CardActionArea>
      ) : (
        <StyledCardContent sx={sx}>{children}</StyledCardContent>
      )}
    </Card>
  )
}

DashboardCard.Media = DashboardCardMedia
DashboardCard.Content = DashboardCardContent
DashboardCard.Title = DashboardCardTitle
DashboardCard.Description = DashboardCardDescription
DashboardCard.ActionButton = DashboardCardActionButton
