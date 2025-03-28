"use client"

import GovBrBreadcrumb from "@/components/ui/GovBrBreadcrumb"
import withPermissao from "@/hoc/withPermissao"
import {
  ChevronLeft,
  ChevronRight,
  Group,
  Home,
  LockPerson,
  Shield,
} from "@mui/icons-material"
import {
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List as MUIList,
  Tooltip,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const links = [
  { href: "/admin", text: "Dashboard", icon: <Home /> },
  { href: "/admin/perfis", text: "Gerenciar Perfis", icon: <Group /> },
  { href: "/admin/permissoes", text: "Permissões", icon: <LockPerson /> },
  { href: "/admin/superadmin", text: "SuperAdmin", icon: <Shield /> },
]

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <GovBrBreadcrumb basePath="/admin" />

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Drawer
          variant="permanent"
          open={drawerOpen}
          slotProps={{
            paper: {
              sx: {
                position: "relative",
                width: drawerOpen ? 240 : 72,
                bgcolor: "background.paper",
                borderRight: 1,
                borderColor: "divider",
                alignSelf: "flex-start",
                overflowX: "hidden",
                transition: "width 0.3s ease",
              },
            },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent={drawerOpen ? "space-between" : "center"}
            px={2}
            py={1}
          >
            {drawerOpen && <Typography variant="subtitle1">Acesso rápido</Typography>}
            <IconButton onClick={() => setDrawerOpen(!drawerOpen)} size="small">
              {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Box>

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
                sx={{ justifyContent: drawerOpen ? "flex-start" : "center", px: 2 }}
              >
                <Tooltip title={!drawerOpen ? text : ""} placement="right" arrow>
                  <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 2 : 0 }}>
                    {icon}
                  </ListItemIcon>
                </Tooltip>
                {drawerOpen && <ListItemText primary={text} />}
              </ListItemButton>
            ))}
          </MUIList>
        </Drawer>

        <Box
          sx={{
            flexGrow: 1,
            minHeight: "60vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
            pl: 1,
            py: 2,
            transition: "margin 0.3s ease",
          }}
        >
          {children}
        </Box>
      </Box>
    </Container>
  )
}
const AdminLayoutProtegido = withPermissao(AdminLayout, "Desabilitar", "Relatorios") // @todo: corrigir permissão

export default AdminLayoutProtegido
