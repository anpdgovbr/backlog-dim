"use client"

import GovBRAvatar from "@/components/avatar/GovBRAvatar"
import FloatingDevMenu from "@/components/menu/FloatingDevMenu"
import SystemTitle from "@/components/ui/SystemTitle"
import { NotificationProvider } from "@/context/NotificationProvider"
import AuthProvider from "@/context/SessionProvider"
import "@/styles/mui-overrides.css"
import { ThemeProvider } from "@/theme/ThemeProvider"
import "@govbr-ds/core/dist/core.css"
import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"

export default function ClientRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const script = document.createElement("script")
    script.src = "/govbr-ds/core-init.js"
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (!isClient) {
    return <p>Carregando...</p>
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              position: "relative",
            }}
          >
            <Box
              component="header"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                backgroundImage:
                  "linear-gradient(135deg, #307244 0%, #00AEEF 50%, #FAA61A 100%)",
                color: "white",
                boxShadow: 2,
                position: "relative",
                zIndex: 1200,
              }}
            >
              <SystemTitle />

              <Box sx={{ position: "relative", display: "inline-block" }}>
                <GovBRAvatar />
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                position: "relative",
                pb: 5,
              }}
            >
              <Box
                component="main"
                sx={{
                  flex: 1,
                  p: 1,
                  display: "flex",
                }}
              >
                {children}
              </Box>
            </Box>

            <Box
              component="footer"
              sx={{
                mt: "auto",
                textAlign: "center",
                py: 2,
                backgroundImage:
                  "linear-gradient(135deg, rgba(48, 114, 68, 0.5) 0%, rgba(0, 174, 239, 0.5) 50%, rgba(250, 166, 26, 0.5) 100%)",
                borderTop: "1px solid rgba(0, 0, 0, 0.2)",
                color: "#000000",
              }}
            >
              <Typography variant="body2" color="inherit">
                (cc) {new Date().getFullYear()} Desenvolvido pela DDSS/CGTI - Autoridade
                Nacional de Proteção de Dados.
              </Typography>
            </Box>
          </Box>
          <FloatingDevMenu />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
