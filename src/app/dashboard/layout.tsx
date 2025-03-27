"use client"

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
} from "@mui/icons-material"
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List as MUIList,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [perfilId, setPerfilId] = useState<number | null>(null)
  const [loadingPerfil, setLoadingPerfil] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`/api/perfil?email=${session?.user?.email}`)
        const data = await res.json()
        setPerfilId(data?.id || null)
      } catch (err) {
        console.error("Erro ao buscar perfil:", err)
      } finally {
        setLoadingPerfil(false)
      }
    }

    if (session?.user?.email) {
      fetchPerfil()
    }
  }, [session?.user?.email])

  const carregando = status === "loading" || loadingPerfil

  if (carregando) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  const links = [{ href: "/dashboard", text: "Página Inicial", icon: <Home /> }]
  if (perfilId === null) {
    links.push({
      href: "/dashboard/configuracoes",
      text: "Configurações",
      icon: <Settings />,
    })
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
        {
          href: "/dashboard/requeridos",
          text: "Requeridos",
          icon: <Business />,
        },
        {
          href: "/dashboard/responsaveis",
          text: "Responsáveis",
          icon: <Person />,
        }
      )
    }

    if (perfilId >= 4) {
      links.push(
        {
          href: "/dashboard/relatorios",
          text: "Relatórios",
          icon: <Assessment />,
        },
        {
          href: "/admin",
          text: "Admin",
          icon: <AdminPanelSettings />,
        }
      )
    }
  }
  links.push({
    href: "/dashboard/configuracoes",
    text: "Configurações",
    icon: <Settings />,
  })

  return (
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <GovBrBreadcrumb basePath="/dashboard" />
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
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
                alignSelf: "flex-start",
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
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(href))
                }
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
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
            p: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Container>
  )
}
