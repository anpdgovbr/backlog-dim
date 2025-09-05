// lib/auditoria-server.ts
import type { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"

export type LogProps = {
  tabela: string
  acao: AcaoAuditoria
  registroId?: number
  userId?: string
  email?: string
  contexto?: string
  antes?: object
  depois?: object
  req?: Request
}

/**
 * Registra um log de auditoria no banco, enriquecendo com IP e User-Agent
 * quando um `Request` estiver disponível.
 *
 * - IP: lido de `x-forwarded-for` ou `x-real-ip` (caso o app esteja atrás de proxy/LB).
 * - User-Agent: lido do header `user-agent`.
 *
 * Observação: Em ambiente local sem proxy, o IP pode não estar presente.
 */
export async function registrarAuditoria({
  tabela,
  acao,
  registroId,
  userId,
  email,
  contexto,
  antes,
  depois,
  req,
}: LogProps) {
  let ip: string | undefined
  let userAgent: string | undefined

  if (req && req instanceof Request) {
    const headers = req.headers
    const xff = headers.get("x-forwarded-for")
    // Padrão: usa o primeiro IP da cadeia do X-Forwarded-For
    ip = xff?.split(",")[0]?.trim() || headers.get("x-real-ip") || undefined
    userAgent = headers.get("user-agent") || undefined
  }

  try {
    await prisma.auditLog.create({
      data: {
        tabela,
        acao,
        registroId,
        userId,
        email,
        contexto,
        antes,
        depois,
        ip,
        userAgent,
      },
    })
  } catch (error) {
    console.error("Erro ao salvar auditoria no servidor:", error)
  }
}
