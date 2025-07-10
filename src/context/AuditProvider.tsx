"use client"

import type { AcaoAuditoria } from "@prisma/client"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { createContext, useContext, useMemo } from "react"

type AuditContextData = {
  userId?: string
  email?: string
  contexto: string
}

type LogAuditoriaInput = {
  tabela: string
  acao: AcaoAuditoria
  registroId?: number
  antes?: object
  depois?: object
}

const AuditContext = createContext<AuditContextData | undefined>(undefined)

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const value = useMemo(() => {
    return {
      userId: session?.user?.id,
      email: session?.user?.email,
      contexto: pathname,
    }
  }, [session?.user?.id, session?.user?.email, pathname])

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
