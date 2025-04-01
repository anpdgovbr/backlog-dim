"use client"

import AdminLogViewer from "@/components/dashboard/AdminLogViewer"
import { Box, Container } from "@mui/material"

export default function AdminHomePage() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "background.default",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,

            minHeight: "60vh",
          }}
        >
          <AdminLogViewer />
        </Box>
      </Box>
    </Container>
  )
}
