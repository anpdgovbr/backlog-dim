"use client"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import "@govbr-ds/core/dist/core.css"

import GovBRAvatar from "@/components/avatar/GovBRAvatar"
import FloatingDevMenu from "@/components/menu/FloatingDevMenu"
import SystemTitle from "@/components/ui/SystemTitle"
import { AuditProvider } from "@/context/AuditProvider"
import { NotificationProvider } from "@/context/NotificationProvider"
import AuthProvider from "@/context/SessionProvider"
import "@/styles/mui-overrides.css"
import { ThemeProvider } from "@/theme/ThemeProvider"

export default function ClientRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <AuditProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                position: "relative",
                overflowX: "hidden",
              }}
            >
              <Box
                component="header"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  backgroundImage:
                    "linear-gradient(135deg, #307244 0%, #00AEEF 50%, #FAA61A 100%)",
                  color: "white",
                  boxShadow: 2,
                  position: "relative",
                  zIndex: 1200,
                  gap: 1,
                  width: "100%",
                  overflowX: "visible",
                }}
              >
                <Box sx={{ minWidth: 0, flexShrink: 1 }}>
                  <SystemTitle />
                </Box>
                <Box
                  sx={{ position: "relative", display: "inline-block", maxWidth: "100%" }}
                >
                  <GovBRAvatar />
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  position: "relative",
                  overflowX: "auto",
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
                  py: { xs: 1, sm: 2 },
                  px: 1,
                  width: "100%",
                  backgroundImage:
                    "linear-gradient(135deg, rgba(48, 114, 68, 0.5) 0%, rgba(0, 174, 239, 0.5) 50%, rgba(250, 166, 26, 0.5) 100%)",
                  borderTop: "1px solid rgba(0, 0, 0, 0.2)",
                  color: "#000000",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  overflowWrap: "break-word",
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
      </AuditProvider>
    </AuthProvider>
  )
}
