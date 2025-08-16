"use client"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import GovBrLoading from "@/components/ui/GovBrLoading"

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  actions?: React.ReactNode
  variant?: "default" | "institutional" | "hero"
  bgColor?: string
}

interface PageLayoutProps {
  children: React.ReactNode
  header?: PageHeaderProps
  loading?: boolean
  loadingMessage?: string
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false
  fullWidth?: boolean
  spacing?: number
}

function PageHeader({
  title,
  subtitle,
  description,
  actions,
  variant = "default",
  bgColor,
}: Readonly<PageHeaderProps>) {
  const isInstitutional = variant === "institutional"
  const isHero = variant === "hero"
  const paddingY = isHero ? 8 : isInstitutional ? 6 : 4

  return (
    <Box
      sx={{
        bgcolor: bgColor || (isInstitutional ? "primary.main" : "background.paper"),
        color: isInstitutional ? "primary.contrastText" : "text.primary",
        py: paddingY,
        mb: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elemento decorativo para versão institucional */}
      {isInstitutional && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              bgcolor: "rgba(255, 255, 255, 0.05)",
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: "50%",
              bgcolor: "rgba(255, 255, 255, 0.03)",
              zIndex: 0,
            }}
          />
        </>
      )}

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={3}
        >
          <Box>
            {subtitle && (
              <Typography
                variant="overline"
                sx={{
                  display: "block",
                  mb: 1,
                  color: isInstitutional ? "rgba(255, 255, 255, 0.8)" : "text.secondary",
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                {subtitle}
              </Typography>
            )}
            <Typography
              variant={isHero ? "h2" : "h3"}
              component="h1"
              gutterBottom={!!description}
              sx={{
                fontWeight: 700,
                color: isInstitutional ? "primary.contrastText" : "text.primary",
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant={isHero ? "h6" : "body1"}
                sx={{
                  color: isInstitutional ? "rgba(255, 255, 255, 0.9)" : "text.secondary",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          {actions && <Box>{actions}</Box>}
        </Stack>
      </Container>
    </Box>
  )
}

export default function PageLayout({
  children,
  header,
  loading = false,
  loadingMessage = "Carregando...",
  maxWidth = "lg",
  fullWidth = false,
  spacing = 4,
}: Readonly<PageLayoutProps>) {
  if (loading) {
    return <GovBrLoading message={loadingMessage} fullScreen />
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        bgcolor: "background.default",
      }}
    >
      {/* Header da página */}
      {header && <PageHeader {...header} />}

      {/* Conteúdo principal */}
      <Box sx={{ py: header ? 0 : spacing }}>
        {fullWidth ? children : <Container maxWidth={maxWidth}>{children}</Container>}
      </Box>
    </Box>
  )
}

// Componente para seções da página
export function PageSection({
  children,
  title,
  subtitle,
  spacing = 4,
  elevation = 0,
  noPadding = false,
}: Readonly<{
  children: React.ReactNode
  title?: string
  subtitle?: string
  spacing?: number
  elevation?: number
  noPadding?: boolean
}>) {
  return (
    <Box sx={{ mb: spacing }}>
      {(title || subtitle) && (
        <Box sx={{ mb: 3 }}>
          {title && (
            <Typography variant="h5" component="h2" gutterBottom={!!subtitle}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {elevation > 0 ? (
        <Paper elevation={elevation} sx={{ p: noPadding ? 0 : 3, borderRadius: 2 }}>
          {children}
        </Paper>
      ) : (
        children
      )}
    </Box>
  )
}
