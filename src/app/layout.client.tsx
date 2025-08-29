"use client"

import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"

import CookieManager from "@/components/cookie/CookieManager"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import FloatingDevMenu from "@/components/menu/FloatingDevMenu"
import { AuditProvider } from "@/context/AuditProvider"
import { NotificationProvider } from "@/context/NotificationProvider"
import AuthProvider from "@/context/SessionProvider"
import { GovBRThemeProvider } from "@anpdgovbr/shared-ui"

export default function ClientRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <GovBRThemeProvider>
      <AuthProvider>
        <AuditProvider>
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
        </AuditProvider>
      </AuthProvider>
    </GovBRThemeProvider>
  )
}
