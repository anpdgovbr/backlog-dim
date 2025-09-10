"use client"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import Link from "next/link"
import { useSession } from "next-auth/react"

import GovBRAvatar from "@/components/avatar/GovBRAvatar"
import SystemTitle from "@/components/ui/SystemTitle"

export default function Header() {
  const { data: session, status } = useSession()
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={(theme) => ({
        backgroundColor: theme.palette.primary.main,
        borderBottom: `3px solid ${theme.palette.primary.dark}`,
        borderRadius: 0,
      })}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          // reduzir a altura para eliminar espaço superior do título
          minHeight: { xs: 56, sm: 64 },
          // remover padding vertical e manter padding horizontal
          py: 0,

          px: { xs: 2, sm: 3 },
          maxWidth: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
            height: "100%",

            color: (theme) => theme.palette.primary.contrastText, // passar cor para filhos
          }}
        >
          <SystemTitle />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: 2,
            height: "100%",
          }}
        >
          {status === "authenticated" ? (
            <GovBRAvatar
              name={session?.user?.name || "Usuário"}
              imageUrl={session?.user?.image || null}
              items={[
                { label: "Meu perfil", href: "/perfil" },
                { label: "Sair", href: "/auth/logout" },
              ]}
            />
          ) : (
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              color="inherit"
              size="small"
            >
              Entrar
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
