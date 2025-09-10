import useSWR from "swr"

import { useSession } from "next-auth/react"

import type { PermissaoDto } from "@anpdgovbr/shared-types"

import { fetcher } from "@/lib/fetcher"
import type { PermissionsMap } from "@anpdgovbr/rbac-core"
import { toPermissionsMap } from "@anpdgovbr/rbac-core"

/**
 * Hook: usePermissoes
 *
 * Recupera as permissões do usuário logado a partir da sessão do NextAuth e
 * converte a lista de DTOs em um mapa de permissões usando o utilitário do
 * pacote de RBAC.
 *
 * Retorno:
 * - permissoes: PermissionsMap — mapa de permissões (vazio caso não haja dados).
 * - loading: boolean — true enquanto a requisição está em andamento.
 * - error: unknown — objeto de erro caso a requisição falhe.
 *
 * Observações:
 * - Depende da sessão provida por next-auth; se não houver e-mail na sessão,
 *   a requisição para /api/permissoes não é realizada.
 * - Não realiza alterações no estado global; apenas expõe os dados retornados.
 *
 * Exemplo:
 * const { permissoes, loading, error } = usePermissoes()
 */
export default function usePermissoes() {
  const { data: session } = useSession()
  const email = session?.user?.email

  const { data, error, isLoading } = useSWR<PermissaoDto[]>(
    email ? `/api/permissoes?email=${email}` : null,
    fetcher
  )

  const permissoes: PermissionsMap = toPermissionsMap(data)

  if (error) {
    console.error("Erro ao buscar permissões:", error)
  }

  return {
    permissoes,
    loading: isLoading,
    error,
  }
}
