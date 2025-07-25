"use client"

import { createContext, useContext, useMemo } from "react"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

import type { AcaoAuditoria } from "@anpdgovbr/shared-types"

type AuditContextData = {
  userId?: string
  email?: string | null
  contexto: string
}

type LogAuditoriaInput = {
  tabela: string
  acao: AcaoAuditoria
  registroId?: number
  antes?: object
  depois?: object
}

// Interface para tipagem específica do usuário com id
interface UserWithId {
  id?: string
  email?: string | null
  name?: string | null
  image?: string | null
}

const AuditContext = createContext<AuditContextData | undefined>(undefined)

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const value = useMemo(() => {
    const user = session?.user as UserWithId | undefined
    return {
      userId: user?.id,
      email: user?.email,
      contexto: pathname,
    }
  }, [session?.user, pathname])

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
}

export function useAuditLogger() {
  const context = useContext(AuditContext)
  if (!context) {
    throw new Error("useAuditLogger deve ser usado dentro de <AuditProvider>")
  }

  const logAuditoria = async ({
    tabela,
    acao,
    registroId,
    antes,
    depois,
  }: LogAuditoriaInput) => {
    const payload = {
      tabela,
      acao,
      registroId,
      userId: context.userId,
      email: context.email,
      contexto: context.contexto,
      antes,
      depois,
    }

    try {
      await fetch("/api/auditoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      console.error("Erro ao registrar auditoria:", error)
    }
  }

  return { logAuditoria }
}
