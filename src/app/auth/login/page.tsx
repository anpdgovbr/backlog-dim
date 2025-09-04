"use client"

import { Suspense, useEffect, useState } from "react"

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

import Box from "@mui/material/Box"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import GovBrLoading from "@/components/ui/GovBrLoading"

function LoginPageInner() {
  const { status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const showLoading = redirecting || isLoading

  // Exibe erros retornados pelo NextAuth (ex.: callback falhou)
  const search = useSearchParams()
  useEffect(() => {
    const err = search.get("error")
    if (err) setError("Falha ao realizar o login. Tente novamente.")
  }, [search])

  // Controle de redirecionamento
  useEffect(() => {
    if (status === "authenticated") {
      setRedirecting(true)
      setIsLoading(true) // Mantém o loading até redirecionar
      const timer = setTimeout(() => {
        router.replace("/dashboard")
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [status, router])

  /**
   * Inicia o fluxo de login OAuth no Azure AD.
   *
   * Observação: para provedores OAuth, quando `redirect: false` é usado,
   * `signIn` retorna um objeto com a `url` para onde devemos navegar manualmente.
   * Caso contrário, a sessão nunca muda para "authenticated" e a UI parece travar.
   * Aqui simplificamos, deixando o NextAuth redirecionar automaticamente.
   */
  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Usar redirect: false para capturar a URL e navegar manualmente.
      const result = await signIn("azure-ad", {
        redirect: false,
        callbackUrl: "/dashboard",
      })

      // Erro explícito reportado pelo NextAuth
      if (result && typeof result === "object" && "error" in result && result.error) {
        setError("Falha ao realizar o login. Tente novamente.")
        setIsLoading(false)
        return
      }

      // Navega para a URL do provedor (fluxo OAuth)
      const url = (result as unknown as { url?: string })?.url
      if (url) {
        // Redirecionamento full page para evitar qualquer bloqueio
        window.location.href = url
        // Fallback de segurança: se nada acontecer em 8s, libera a UI e mostra erro
        setTimeout(() => {
          setIsLoading(false)
          setError(
            "Não foi possível redirecionar para o provedor. Verifique sua conexão e tente novamente."
          )
        }, 8000)
        return
      }

      // Caso não haja URL nem erro, libera a UI e mostra mensagem genérica
      setIsLoading(false)
      setError("Não foi possível iniciar o login. Tente novamente.")
    } catch (err) {
      setError("Falha ao realizar o login. Tente novamente.")
      setIsLoading(false)
    }
  }

  // Exibir loading apenas durante transições críticas iniciadas pelo usuário
  if (showLoading) {
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

        <GovBRButton
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
        </GovBRButton>

        <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
          Acesso restrito a usuários autorizados
        </Typography>
      </Box>
    </Container>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<GovBrLoading message="Carregando..." />}>
      <LoginPageInner />
    </Suspense>
  )
}
