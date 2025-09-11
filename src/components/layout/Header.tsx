"use client"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import SystemTitle from "@/components/ui/SystemTitle"
import { GovBRAvatar, GovBRSignIn } from "@anpdgovbr/shared-ui"
export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleLogin = () => {
    router.push("/auth/login")
  }

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
          minHeight: { xs: 56, sm: 64 },
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

            color: (theme) => theme.palette.primary.contrastText,
          }}
        >
          <SystemTitle />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {status === "authenticated" ? (
            <GovBRAvatar title={session?.user?.name || "Usuário"} />
          ) : (
            <GovBRSignIn
              variant="outlined"
              onClick={handleLogin} // navega para /auth/login usando next/navigation
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
