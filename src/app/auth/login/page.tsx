"use client"

import { Suspense, useEffect, useState, useRef } from "react"

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import GovBrLoading from "@/components/ui/GovBrLoading"

function LoginPageInner() {
  const { status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const autoStarted = useRef(false)
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

  // Inicia automaticamente o fluxo de login quando não autenticado
  useEffect(() => {
    if (status === "unauthenticated" && !autoStarted.current) {
      autoStarted.current = true
      handleLogin()
    }
  }, [status])

  /**
   * Inicia o fluxo de login OAuth via Keycloak.
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
      const providerId = process.env.NEXT_PUBLIC_AUTH_PROVIDER || "keycloak"
      const result = await signIn(providerId, {
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
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Redirecionando para o provedor de login...
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
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
