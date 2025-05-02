"use client"

import MobileMenu from "@/components/menu/MobileMenu"
import type { LinkItem } from "@/components/menu/SideMenu"
import SideMenu from "@/components/menu/SideMenu"
import GovBrBreadcrumb from "@/components/ui/GovBrBreadcrumb"
import withPermissao from "@/hoc/withPermissao"
import {
  Group,
  Home,
  LockPerson,
  Shield,
  SupervisedUserCircleOutlined,
  ViewCompactAltOutlined,
} from "@mui/icons-material"
import { Box, Container, useMediaQuery, useTheme } from "@mui/material"
import { usePathname } from "next/navigation"

const links: LinkItem[] = [
  { href: "/admin", text: "Painel de Gestão", icon: <Home /> },
  { href: "/dashboard", text: "Painel de trabalho", icon: <ViewCompactAltOutlined /> },
  { href: "/admin/perfis", text: "Gerenciar Perfis", icon: <Group /> },
  { href: "/admin/auditoria", text: "Auditoria", icon: <SupervisedUserCircleOutlined /> },
  { href: "/admin/permissoes", text: "Permissões", icon: <LockPerson /> },
  { href: "/admin/superadmin", text: "SuperAdmin", icon: <Shield /> },
]

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.only("xs"))

  return (
    <Container maxWidth="lg">
      {!isXs && <GovBrBreadcrumb basePath="/admin" />}

      {isXs ? (
        <MobileMenu links={links} pathname={pathname} title="Admin Dashboard" />
      ) : null}

      <Box
        sx={{
          display: "flex",
          flexDirection: isXs ? "column" : "row",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        {!isXs && (
          <SideMenu
            links={links}
            pathname={pathname}
            title="Admin"
            storageKey="drawerDashboard"
          />
        )}
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
            width: "100%",
            maxWidth: { xs: "100%", sm: "calc(100% - 60px)", md: "calc(100% - 60px)" },
            minWidth: { xs: "auto", sm: 400 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Container>
  )
}

export default withPermissao(AdminLayout, "Desabilitar", "Relatorios")
