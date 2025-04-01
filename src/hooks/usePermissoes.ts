import { fetcher } from "@/lib/fetcher"
import { Permissao, PermissaoConcedida } from "@/types/Permissao"
import { useSession } from "next-auth/react"
import useSWR from "swr"

export default function usePermissoes() {
  const { data: session } = useSession()
  const email = session?.user?.email

  const { data, error, isLoading } = useSWR<Permissao[]>(
    email ? `/api/permissoes?email=${email}` : null,
    fetcher
  )

  const permissoes: Partial<Record<PermissaoConcedida, boolean>> = {}

  if (Array.isArray(data)) {
    for (const p of data) {
      permissoes[`${p.acao}_${p.recurso}` as PermissaoConcedida] = p.permitido
    }
  }

  if (error) {
    console.error("Erro ao buscar permissões:", error)
  }

  return {
    permissoes,
    loading: isLoading,
    error,
  }
}

export function pode(
  permissoes: Partial<Record<PermissaoConcedida, boolean>>,
  acao: PermissaoConcedida
): boolean {
  return permissoes[acao] ?? false
}
