"use client"

import GovBrBreadcrumb from "@/components/ui/GovBrBreadcrumb"
import { Group, Home, LockPerson, Shield } from "@mui/icons-material"
import {
  Box,
  Container,
  Divider,
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List as MUIList,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/admin", text: "Dashboard", icon: <Home /> },
  { href: "/admin/perfis", text: "Gerenciar Perfis", icon: <Group /> },
  { href: "/admin/permissoes", text: "Permissões", icon: <LockPerson /> },
  { href: "/admin/superadmin", text: "SuperAdmin", icon: <Shield /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <GovBrBreadcrumb basePath="/admin" />

      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Drawer
          variant="permanent"
          slotProps={{
            paper: {
              sx: {
                position: "relative",
                width: 240,
                bgcolor: "background.paper",
                borderRight: 1,
                borderColor: "divider",
                alignSelf: "flex-start", // mantém o menu com altura natural
              },
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ px: 2, py: 2 }}>
            Acesso rápido
          </Typography>
          <Divider />
          <MUIList>
            {links.map(({ href, text, icon }) => (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                selected={
                  pathname === href || (href !== "/admin" && pathname.startsWith(href))
                }
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </MUIList>
        </Drawer>

        <Box sx={{ flexGrow: 1, minHeight: "60vh" }}>{children}</Box>
      </Box>
    </Container>
  )
}
