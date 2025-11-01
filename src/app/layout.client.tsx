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
import { ANPDThemeProvider } from "@anpdgovbr/shared-ui"
// Mantemos StyledEngineProvider injectFirst para priorizar MUI sobre CSS global
// (GovBR DS Core), enquanto o AppRouterCacheProvider está no layout server.
import { StyledEngineProvider } from "@mui/material/styles"

/**
 * ClientRootLayout
 *
 * Layout raiz executado no lado do cliente que envolve a aplicação com os
 * providers necessários e estrutura de página:
 * - GovBRThemeProvider: tema compartilhado
 * - AuthProvider: contexto de sessão/autenticação
 * - AuditProvider: provedor de auditoria
 * - NotificationProvider: provedor de notificações
 * - CookieManager: gerenciamento de cookies
 *
 * A estrutura de layout inclui Header, Footer, a área principal (onde os
 * children são renderizados) e o FloatingDevMenu. Também aplica CssBaseline
 * para reset de estilos globais.
 *
 * Props:
 * @param children - Conteúdo ReactNode renderizado dentro do layout (imutável).
 *
 * @returns JSX.Element - Estrutura de layout com providers e área principal.
 */
export default function ClientRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Observação:
    // - AppRouterCacheProvider está no layout server (layout.tsx), conforme recomendado pela MUI.
    // - Aqui ficam os providers client-side (tema compartilhado, sessão, auditoria etc.).
    <StyledEngineProvider injectFirst>
      <ANPDThemeProvider>
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
      </ANPDThemeProvider>
    </StyledEngineProvider>
  )
}
