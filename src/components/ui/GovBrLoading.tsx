"use client"

import { Box, CircularProgress, Typography } from "@mui/material"

export default function GovBrLoading({ message = "Carregando..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: "primary.main",
          mb: 2,
        }}
      />
      <Typography variant="h6" color="text.primary">
        {message}
      </Typography>
    </Box>
  )
}
