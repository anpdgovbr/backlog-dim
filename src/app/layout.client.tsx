"use client"

import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"

import CookieManager from "@/components/cookie/CookieManager"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import FloatingDevMenu from "@/components/menu/FloatingDevMenu"
import { AuditProvider } from "@/context/AuditProvider"
import { NotificationProvider } from "@/context/NotificationProvider"
import AuthProvider from "@/context/SessionProvider"
import { govbrTheme } from "@anpdgovbr/shared-ui"

// Importando apenas CSS essencial mínimo
import "@/styles/essential.css"

// Removendo CSS legados para migração shared-ui:
// "@govbr-ds/core/dist/core.css" - comentado anteriormente
// "@/styles/mui-overrides.css" - não necessário com shared-ui

export default function ClientRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <AuditProvider>
        <ThemeProvider theme={govbrTheme}>
          <CssBaseline />
          <NotificationProvider>
            <CookieManager>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                  position: "relative",
                  overflowX: "hidden",
                }}
              >
                <Header />

                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflowX: "auto",
                  }}
                >
                  <Box
                    component="main"
                    sx={{
                      flex: 1,
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {children}
                  </Box>
                </Box>

                <Footer />
              </Box>
              <FloatingDevMenu />
            </CookieManager>
          </NotificationProvider>
        </ThemeProvider>
      </AuditProvider>
    </AuthProvider>
  )
}
