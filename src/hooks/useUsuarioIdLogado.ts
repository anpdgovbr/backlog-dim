// Este módulo contém hooks personalizados para recuperação de dados do usuário.

"use client"

import useSWR from "swr"

import { useSession } from "next-auth/react"

import { fetcher } from "@/lib/fetcher"

/**
 * Hook: useUsuarioIdLogado
 *
 * Recupera o ID do usuário logado com base na sessão do NextAuth.
 *
 * Internamente:
 * - Obtém o email do usuário a partir de `useSession`.
 * - Faz um GET para o endpoint `/api/usuarios/email/{email}` usando SWR e o `fetcher` do projeto.
 *
 * Retorno:
 * - userId: string | null — ID do usuário quando disponível; null caso ainda não haja dados.
 * - loading: boolean — true enquanto a requisição está em andamento.
 * - error: unknown — objeto de erro quando a requisição falha.
 *
 * Observações:
 * - Este é um hook para uso em componentes do cliente (contém "use client").
 * - A requisição só é feita quando o email do usuário estiver presente na sessão.
 *
 * Exemplo:
 * const { userId, loading, error } = useUsuarioIdLogado()
 *
 * @returns Readonly<{
 *   userId: string | null;
 *   loading: boolean;
 *   error: unknown;
 * }>
 */
export function useUsuarioIdLogado() {
  const { data: session } = useSession()
  const email = session?.user?.email

  const { data, error, isLoading } = useSWR(
    email ? `/api/usuarios/email/${email}` : null,
    fetcher
  )

  return {
    userId: data?.id ?? null,
    loading: isLoading,
    error,
  }
}
