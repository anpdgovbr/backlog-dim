// lib/auditoria-server.ts
import { prisma } from "@/lib/prisma"
import { AcaoAuditoria } from "@prisma/client"

type LogProps = {
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
    ip = headers.get("x-forwarded-for") || headers.get("x-real-ip") || undefined
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
