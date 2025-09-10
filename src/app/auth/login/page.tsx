"use client"

import { Suspense, useEffect, useState, useRef, useCallback } from "react"

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"

import GovBrLoading from "@/components/ui/GovBrLoading"

function LoginPageInner() {
  const { status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [providerReady, setProviderReady] = useState<boolean | null>(null)
  const [providerMsg, setProviderMsg] = useState<string>("")
  const [redirecting, setRedirecting] = useState(false)
  const autoStarted = useRef(false)
  const showLoading = redirecting || isLoading

  // Exibe erros retornados pelo NextAuth (ex.: callback falhou)
  const search = useSearchParams()
  const hasErrorParam = !!search.get("error")
  useEffect(() => {
    const err = search.get("error")
    if (err) {
      // Evita loop: não inicia login automático quando houver erro na URL
      const map: Record<string, string> = {
        OAuthSignin:
          "Falha ao iniciar a autenticação (OAuthSignin). O provedor pode estar indisponível ou mal configurado.",
        OAuthCallback:
          "Falha ao concluir a autenticação (OAuthCallback). Tente novamente.",
        CallbackRouteError: "Erro ao processar retorno de autenticação. Tente novamente.",
      }
      setError(
        map[err] ||
          "Falha ao iniciar a autenticação. Verifique o serviço de identidade e tente novamente."
      )
    }
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
  const checkProvider = useCallback(async () => {
    try {
      setProviderReady(null)
      setProviderMsg("")
      const res = await fetch("/api/auth/status", { cache: "no-store" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setProviderReady(false)
        setProviderMsg(
          body?.message ||
            "Serviço de autenticação indisponível no momento. Tente novamente mais tarde."
        )
        return false
      }
      setProviderReady(true)
      setProviderMsg("")
      return true
    } catch {
      setProviderReady(false)
      setProviderMsg("Não foi possível verificar o provedor de autenticação.")
      return false
    }
  }, [])

  useEffect(() => {
    const run = async () => {
      if (status !== "unauthenticated" || autoStarted.current) return
      // Evita reentrância
      autoStarted.current = true

      // Se já veio com erro do NextAuth, apenas exibe e não tenta de novo
      if (hasErrorParam) {
        setProviderReady(false)
        return
      }

      const ok = await checkProvider()
      if (!ok) return
      await handleLogin()
    }
    run()
  }, [status, hasErrorParam, checkProvider])

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
        setError(
          "Falha ao iniciar o login com o provedor. Verifique se o Keycloak está disponível."
        )
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
      console.error("Erro ao iniciar login:", err)
      setError(
        "Falha ao iniciar a autenticação. Verifique o serviço de identidade e tente novamente."
      )
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
          Acesso ao sistema
        </Typography>

        {providerReady === false && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {providerMsg ||
              "Serviço de autenticação indisponível. Tente novamente em instantes."}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {providerReady === null && !error && (
          <Typography sx={{ mb: 2 }}>Verificando provedor de autenticação…</Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              // Antes de tentar, valide disponibilidade
              const ok = await checkProvider()
              if (ok) await handleLogin()
            }}
            disabled={isLoading}
          >
            Entrar com Keycloak
          </Button>
          <Button
            variant="outlined"
            onClick={checkProvider}
            disabled={isLoading}
            color="secondary"
          >
            Recarregar status
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
          Em caso de indisponibilidade do Keycloak, tente novamente mais tarde ou contate
          o suporte.
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
