// components/notification/TopNotification.tsx
import { CheckCircle, Close, Error, Info, Warning } from "@mui/icons-material"
import type { SlideProps } from "@mui/material"
import { Box, IconButton, Slide, Snackbar, Typography, alpha } from "@mui/material"
import { useTheme } from "@mui/material/styles"

type NotificationType = "success" | "error" | "info" | "warning"

interface TopNotificationProps {
  open: boolean
  message: string
  type: NotificationType
  onClose: () => void
}

const iconMap = {
  success: <CheckCircle fontSize="inherit" />,
  error: <Error fontSize="inherit" />,
  info: <Info fontSize="inherit" />,
  warning: <Warning fontSize="inherit" />,
}
const SlideDown = (props: SlideProps) => <Slide {...props} direction="down" />
export default function TopNotification({
  open,
  message,
  type,
  onClose,
}: TopNotificationProps) {
  const theme = useTheme()

  const color = theme.palette[type]?.main || theme.palette.info.main
  const colorD = theme.palette[type]?.dark || theme.palette.info.dark
  const transparentBg = alpha(color, 0.9)

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      slots={{ transition: SlideDown }}
      autoHideDuration={400000}
      onClose={onClose}
      sx={{
        top: "0 !important",
        left: 0,
        right: 0,
        width: "100%",
        maxWidth: "100% !important",
        position: "fixed",
        zIndex: theme.zIndex.snackbar,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: transparentBg,
          color: theme.palette.text.primary,
          borderBottom: `4px solid ${colorD}`,
          px: 3,
          py: 2,
          width: "100%",
          boxShadow: theme.shadows[4],
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Box
            sx={{ color: "white", fontSize: 28, display: "flex", alignItems: "center" }}
          >
            {iconMap[type]}
          </Box>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: theme.palette.primary.contrastText,
              lineHeight: 1.2,
              letterSpacing: 0.5,
              padding: 0,
            }}
          >
            {message}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: theme.palette.text.secondary }}
          size="small"
        >
          <Close />
        </IconButton>
      </Box>
    </Snackbar>
  )
}
