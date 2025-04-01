"use client"

import { Box, CircularProgress, Typography } from "@mui/material"

interface GovBrLoadingProps {
  message?: string
  fullScreen?: boolean
  minHeight?: number | string
}

export default function GovBrLoading({
  message = "Carregando...",
  fullScreen = false,
  minHeight = 200,
}: GovBrLoadingProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: fullScreen ? "100vh" : "100%",
        minHeight: fullScreen ? "100vh" : minHeight,
        bgcolor: fullScreen ? "background.default" : "transparent",
        textAlign: "center",
        px: 2,
      }}
    >
      <CircularProgress
        size={50}
        thickness={4}
        sx={{
          color: "primary.main",
          mb: 2,
        }}
      />
      <Typography variant="body1" color="text.primary">
        {message}
      </Typography>
    </Box>
  )
}
