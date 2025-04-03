"use client"

import SideMenu, { LinkItem } from "@/components/menu/SideMenu"
import GovBrBreadcrumb from "@/components/ui/GovBrBreadcrumb"
import withPermissao from "@/hoc/withPermissao"
import {
  Group,
  Home,
  LockPerson,
  Shield,
  ViewCompactAltOutlined,
} from "@mui/icons-material"
import { Box, Container } from "@mui/material"
import { usePathname } from "next/navigation"

const links: LinkItem[] = [
  { href: "/admin", text: "Painel de Gestão", icon: <Home /> },
  { href: "/dashboard", text: "Painel de trabalho", icon: <ViewCompactAltOutlined /> },
  { href: "/admin/perfis", text: "Gerenciar Perfis", icon: <Group /> },
  { href: "/admin/permissoes", text: "Permissões", icon: <LockPerson /> },
  { href: "/admin/superadmin", text: "SuperAdmin", icon: <Shield /> },
]

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <GovBrBreadcrumb basePath="/admin" />
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <SideMenu
          links={links}
          pathname={pathname}
          title="Admin"
          storageKey="drawerAdmin"
        />
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

export default withPermissao(AdminLayout, "Desabilitar", "Relatorios")
