import { Permissao, PermissaoConcedida } from "@/types/Permissao"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function usePermissoes() {
  const { data: session } = useSession()
  const [permissoes, setPermissoes] = useState<
    Partial<Record<PermissaoConcedida, boolean>>
  >({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) return // aguarde até estar disponível

    setLoading(true) // marca como carregando só quando for buscar

    fetch(`/api/permissoes?email=${session.user.email}`)
      .then((res) => res.json())
      .then((data: Permissao[]) => {
        if (!Array.isArray(data)) {
          console.error("Erro: API retornou dados inválidos", data)
          setLoading(false)
          return
        }

        const mapa = data.reduce<Partial<Record<PermissaoConcedida, boolean>>>(
          (acc, p) => {
            acc[`${p.acao}_${p.recurso}` as PermissaoConcedida] = p.permitido
            return acc
          },
          {}
        )

        setPermissoes(mapa)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erro ao buscar permissões:", err)
        setLoading(false)
      })
  }, [session?.user?.email])

  return { permissoes, loading }
}

export function pode(
  permissoes: Partial<Record<PermissaoConcedida, boolean>>,
  acao: PermissaoConcedida
): boolean {
  return permissoes[acao] ?? false
}
