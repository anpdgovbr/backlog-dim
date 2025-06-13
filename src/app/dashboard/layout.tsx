"use client"

import MobileMenu from "@/components/menu/MobileMenu"
import type { LinkItem } from "@/components/menu/SideMenu"
import SideMenu from "@/components/menu/SideMenu"
import GovBrBreadcrumb from "@/components/ui/GovBrBreadcrumb"
import {
  AdminPanelSettings,
  Assessment,
  Business,
  Home,
  ManageSearch,
  Person,
  Settings,
  TableChart,
  UploadFile,
} from "@mui/icons-material"
import { Box, CircularProgress, Container } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const theme = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const email = session?.user?.email
  const [perfilId, setPerfilId] = useState<number | null>(null)
  const [loadingPerfil, setLoadingPerfil] = useState(true)
  const isXs = useMediaQuery(theme.breakpoints.only("xs"))

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
  }, [status, router])

  useEffect(() => {
    if (!email) return
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`/api/perfil?email=${email}`)
        const data = await res.json()
        setPerfilId(data?.id || null)
      } catch (err) {
        console.error("Erro ao buscar perfil:", err)
      } finally {
        setLoadingPerfil(false)
      }
    }
    fetchPerfil()
  }, [email])

  if (status === "loading" || loadingPerfil) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  const links: LinkItem[] = [
    { href: "/dashboard", text: "Página Inicial", icon: <Home /> },
  ]
  if (perfilId === null) {
    links.push({ href: "#", text: "Configurações", icon: <Settings /> })
  } else {
    if (perfilId >= 1) {
      links.push({
        href: "/dashboard/processos",
        text: "Processos",
        icon: <ManageSearch />,
      })
    }
    if (perfilId >= 2) {
      links.push({
        href: "/dashboard/metadados",
        text: "Metadados",
        icon: <TableChart />,
      })
    }
    if (perfilId >= 3) {
      links.push(
        { href: "/dashboard/importar", text: "Importar", icon: <UploadFile /> },
        { href: "/dashboard/requeridos", text: "Requeridos", icon: <Business /> },
        { href: "/dashboard/responsaveis", text: "Responsáveis", icon: <Person /> }
      )
    }
    if (perfilId >= 4) {
      links.push(
        { href: "/dashboard/relatorios", text: "Relatórios", icon: <Assessment /> },
        { href: "/admin", text: "Admin", icon: <AdminPanelSettings /> }
      )
    }
  }

  return (
    <Container maxWidth="xl">
      {!isXs && <GovBrBreadcrumb basePath="/dashboard" />}

      {/* AppBar no topo - sempre fora do Box flex */}
      {isXs ? <MobileMenu links={links} pathname={pathname} title="Dashboard" /> : null}

      {/* Layout principal */}
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
            title="Dashboard"
            storageKey="drawerDashboard"
          />
        )}

        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
            width: "100%",
            maxWidth: { xs: "100%" },
            minWidth: { xs: "auto", sm: 400 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Container>
  )
}
