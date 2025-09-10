// lib/auditoria-server.ts
import type { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"

/**
 * Propriedades usadas para criar um registro de auditoria.
 *
 * @remarks
 * Este tipo descreve os campos aceitos pelo helper `registrarAuditoria`.
 * Alguns campos são opcionais (por exemplo `registroId`, `userId`, `email`)
 * pois a origem do evento pode variar (ações em lote, sistemas externos, etc).
 *
 * Campos relacionados a `antes` e `depois` aceitam objetos livres que serão
 * persistidos no campo JSON do modelo `auditLog`.
 *
 * @property tabela - Nome da tabela/entidade auditada (ex.: "processos").
 * @property acao - Ação auditada, conforme enum `AcaoAuditoria`.
 * @property registroId - Identificador numérico do registro afetado (quando aplicável).
 * @property userId - Identificador interno do usuário que realizou a ação.
 * @property email - Email do usuário (útil para rastreabilidade em auths externas).
 * @property contexto - Texto livre descrevendo contexto adicional (por exemplo: motivo).
 * @property antes - Estado do recurso antes da ação (objeto serializável).
 * @property depois - Estado do recurso depois da ação (objeto serializável).
 * @property req - Requisição HTTP opcional; quando presente, o helper tentará
 *                 extrair IP e User-Agent dos headers.
 */
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
 * Registra um log de auditoria no banco de dados.
 *
 * @remarks
 * - Enriquecimentos: quando uma `Request` é fornecida, a função tenta extrair
 *   o IP (a partir de `x-forwarded-for` ou `x-real-ip`) e o `user-agent`.
 * - Resiliência: erros ao persistir o log são capturados e escritos em console,
 *   para não interferir no fluxo da aplicação (função não lança).
 * - Persistência: grava um registro na tabela `auditLog` via Prisma.
 *
 * @param props - Propriedades do log (veja {@link LogProps}).
 *
 * @example
 * await registrarAuditoria({
 *   tabela: "processos",
 *   acao: "UPDATE",
 *   registroId: 123,
 *   userId: "user-1",
 *   email: "user@example.com",
 *   antes: { status: "Pendente" },
 *   depois: { status: "Concluído" },
 * })
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
