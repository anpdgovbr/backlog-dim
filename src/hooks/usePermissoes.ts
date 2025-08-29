import useSWR from "swr"

import { useSession } from "next-auth/react"

import type { PermissaoDto } from "@anpdgovbr/shared-types"

import { fetcher } from "@/lib/fetcher"
import type { PermissionsMap } from "@/lib/permissions"
import { toPermissionsMap } from "@/lib/permissions"

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
