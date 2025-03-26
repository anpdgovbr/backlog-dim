"use client"

import GovBrLoading from "@/components/ui/GovBrLoading"
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const { status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  // Controle de redirecionamento
  useEffect(() => {
    if (status === "authenticated") {
      setRedirecting(true)
      const timer = setTimeout(() => {
        router.replace("/dashboard")
      }, 500) // Pequeno delay para exibir o loading

      return () => clearTimeout(timer)
    }
  }, [status, router])

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signIn("azure-ad", {
        redirect: false,
        callbackUrl: "/dashboard",
      })
    } catch (err) {
      setError("Falha ao realizar o login. Tente novamente.")
      console.error("Erro de login:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Exibir loading durante transições críticas
  if (redirecting || status === "loading" || isLoading) {
    return (
      <GovBrLoading
        message={redirecting ? "Redirecionando..." : "Verificando sessão..."}
      />
    )
  }

  // Não renderizar nada se já estiver autenticado (redundância de segurança)
  if (status === "authenticated") return null

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 2,
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          p: 4,
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Acesso ao Sistema de Processamento
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={isLoading}
          sx={{
            mt: 2,
            px: 4,
            py: 2,
            fontSize: "1.1rem",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Entrar com Login Institucional"
          )}
        </Button>

        <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
          Acesso restrito a usuários autorizados
        </Typography>
      </Box>
    </Container>
  )
}
