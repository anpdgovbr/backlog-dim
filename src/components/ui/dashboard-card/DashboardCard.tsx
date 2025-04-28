import { CardActionArea, styled } from "@mui/material"
import type { SxProps } from "@mui/material"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

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
        transition: "box-shadow 0.3s ease",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          boxShadow: hasAction ? "0px 6px 15px rgba(0, 0, 0, 0.2)" : undefined,
        },
        ...sx,
      }}
    >
      {hasAction ? (
        <CardActionArea onClick={action} sx={{ height: "100%" }} id={id}>
          <StyledCardContent sx={sx} id={id}>
            {children}
          </StyledCardContent>
        </CardActionArea>
      ) : (
        <StyledCardContent sx={sx} id={id}>
          {children}
        </StyledCardContent>
      )}
    </Card>
  )
}

DashboardCard.Media = DashboardCardMedia
DashboardCard.Content = DashboardCardContent
DashboardCard.Title = DashboardCardTitle
DashboardCard.Description = DashboardCardDescription
DashboardCard.ActionButton = DashboardCardActionButton
