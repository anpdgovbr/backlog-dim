"use client"

import { useEffect, useState } from "react"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
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
   * Executa o fluxo completo de logout:
   * 1. Define estado de loading e limpa estado de erro.
   * 2. Envia DELETE para /api/auth/session para forçar limpeza server-side.
   * 3. Redireciona o usuário para "/" imediatamente.
   * 4. Invoca `signOut` do NextAuth para limpar a sessão no provedor (redirect: false).
   *
   * Em caso de erro, atualiza `error` com mensagem apropriada e loga o erro no console.
   *
   * Nota: a função é assíncrona e atualiza estados locais (`isLoading`, `error`).
   */
  const handleLogout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Forçar limpeza completa da sessão
      await fetch("/api/auth/session", {
        method: "DELETE",
      })

      // Redirecionamento imediato
      router.push("/")

      // Efetuar logout após redirecionamento
      await signOut({
        redirect: false,
        callbackUrl: "/",
      })
    } catch (err) {
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

        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>
          Tentar novamente
        </Button>

        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => router.push("/")}>
          Ir para página inicial
        </Button>
      </Box>
    )
  }

  return null
}
