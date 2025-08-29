"use client"

import { useEffect, useState } from "react"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import GovBrLoading from "@/components/ui/GovBrLoading"

/**
 * Componente de página de Login (Client Component).
 *
 * Descrição:
 * - Gerencia o fluxo de autenticação via NextAuth (provê integração com Azure AD).
 * - Exibe estados de loading durante verificação de sessão e redirecionamento.
 * - Dispara signIn("azure-ad") ao acionar o botão de login e trata erros locais.
 *
 * Comportamento:
 * - Quando a sessão está autenticada, inicia redirecionamento para "/dashboard".
 * - Mostra GovBrLoading enquanto verifica/realiza redirecionamento ou enquanto a ação de login está em andamento.
 *
 * Observações de implementação:
 * - É um componente client ( contém "use client" no topo do arquivo ).
 * - Não altera estado global externo; todo estado é local ao componente.
 * - Erros de login são exibidos via estado local `error`.
 */
export default function LoginPage() {
  const { status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const showLoading = redirecting || isLoading || status === "loading"

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

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await signIn("azure-ad", {
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (result?.error) {
        setError("Falha ao realizar o login. Tente novamente.")
        setIsLoading(false) // só desliga o loading se falhou
      }

      // Se deu certo, não faz nada — o `useEffect` cuidará do redirecionamento
    } catch (err) {
      setError("Falha ao realizar o login. Tente novamente.")
      console.error("Erro de login:", err)
      setIsLoading(false)
    }
  }

  // Exibir loading durante transições críticas
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
