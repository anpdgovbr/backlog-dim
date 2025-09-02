"use client"
import Link from "next/link"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export default function RbacAdminDashboardCard() {
  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper", boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        RBAC Admin
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Gerencie perfis, permissões e atribuições de forma centralizada.
      </Typography>
      <Link href="/rbac-admin">Ir para RBAC Admin</Link>
    </Box>
  )
}
