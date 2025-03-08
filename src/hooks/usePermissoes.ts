import { Permissao } from "@/types/Permissao"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function usePermissoes() {
  const { data: session } = useSession()
  const [permissoes, setPermissoes] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false)
      return
    }

    fetch(`/api/permissoes?email=${session.user.email}`)
      .then((res) => res.json())
      .then((data: Permissao[]) => {
        if (!Array.isArray(data)) {
          console.error("Erro: API retornou dados inválidos", data)
          setLoading(false)
          return
        }
        const mapa = data.reduce<Record<string, boolean>>((acc, p) => {
          acc[`${p.acao}_${p.recurso}`] = p.permitido
          return acc
        }, {})
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
