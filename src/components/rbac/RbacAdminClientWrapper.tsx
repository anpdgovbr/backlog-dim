"use client"
import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"

type Status = "loading" | "ok" | "forbidden" | "error"
type Props = Readonly<{}>

// Carrega o componente cliente sem SSR
const RbacAdminClient = dynamic(() => import("./RbacAdminClient"), { ssr: false })

export default function RbacAdminClientWrapper(_: Props) {
  const [status, setStatus] = useState<Status>("loading")

  useEffect(() => {
    let mounted = true

    async function checkPermissoes() {
      try {
        const res = await fetch("/api/permissoes", { credentials: "include" })
        if (!mounted) return
        if (res.ok) {
          setStatus("ok")
        } else if (res.status === 403) {
          setStatus("forbidden")
        } else {
          setStatus("error")
          console.error("Verificação de permissões retornou status:", res.status)
        }
      } catch (err) {
        if (!mounted) return
        setStatus("error")
        console.error("Erro ao verificar permissões:", err)
      }
    }

    checkPermissoes()
    return () => {
      mounted = false
    }
  }, [])

  if (status === "loading") {
    return <div>Carregando verificação de permissões...</div>
  }

  if (status === "forbidden") {
    return <div>Você não tem permissão para acessar esta área.</div>
  }

  if (status === "error") {
    return <div>Erro ao verificar permissões. Tente novamente mais tarde.</div>
  }

  // status === 'ok'
  return <RbacAdminClient />
}
