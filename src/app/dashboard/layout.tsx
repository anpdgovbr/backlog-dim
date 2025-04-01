"use client"

import SideMenu, { LinkItem } from "@/components/menu/SideMenu"
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
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const email = session?.user?.email
  const [perfilId, setPerfilId] = useState<number | null>(null)
  const [loadingPerfil, setLoadingPerfil] = useState(true)

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
      <Container maxWidth="lg">
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
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <GovBrBreadcrumb basePath="/dashboard" />
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <SideMenu
          links={links}
          pathname={pathname}
          title="Dashboard"
          storageKey="drawerDashboard"
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
