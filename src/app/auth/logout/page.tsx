"use client"

import { useEffect, useState } from "react"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import Typography from "@mui/material/Typography"

import GovBrLoading from "@/components/ui/GovBrLoading"

/**
 * Página/Componente responsável por realizar o logout do usuário.
 *
 * Fluxo:
 * - Tenta remover a sessão no endpoint local (/api/auth/session) via DELETE.
 * - Redireciona o usuário para a rota raiz ("/").
 * - Chama `signOut` do NextAuth para garantir que o provedor também encerre a sessão.
 *
 * Estado:
 * - isLoading: indica que o processo de logout está em andamento.
 * - error: string com mensagem legível caso ocorra falha no logout.
 *
 * Observações:
 * - É um Client Component (contém "use client").
 * - Não recebe props; é usado como página de rota em /auth/logout.
 */
export default function LogoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handleLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Executa o fluxo de logout com SLO (Keycloak):
   * 1) Obtém URL de logout do Keycloak via API (/api/auth/slo).
   * 2) Limpa sessão local (NextAuth) com redirect: false.
   * 3) Redireciona para o endpoint do Keycloak (encerra SSO) e retorna ao app.
   * Fallback: se falhar, chama signOut com callback local.
   */
  const handleLogout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // 1) Montar URL SLO
      let sloUrl: string | undefined
      try {
        const res = await fetch("/api/auth/slo")
        if (res.ok) {
          const data = (await res.json()) as { url?: string }
          sloUrl = data.url
        }
      } catch {
        // ignora e segue para fallback
      }

      // 2) Limpar sessão local
      await signOut({ redirect: false })

      // 3) Redirecionar para Keycloak (se disponível), senão voltar ao início
      if (sloUrl) {
        window.location.href = sloUrl
        return
      }
      router.replace("/")
    } catch (err) {
      console.error("Erro ao sair do sistema:", err)
      setError("Falha ao sair do sistema. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <GovBrLoading message="Saindo do sistema..." />
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "75vh",
          textAlign: "center",
          p: 3,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>

        <GovBRButton
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </GovBRButton>

        <GovBRButton variant="outlined" sx={{ mt: 2 }} onClick={() => router.push("/")}>
          Ir para página inicial
        </GovBRButton>
      </Box>
    )
  }

  return null
}
