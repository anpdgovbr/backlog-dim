"use client"

import AdminLogViewer from "@/components/dashboard/AdminLogViewer"
import { Container } from "@mui/material"

export default function AuditoriaPage() {
  return (
    <Container maxWidth="lg" sx={{ m: 0, p: 0 }}>
      <AdminLogViewer />
    </Container>
  )
}
