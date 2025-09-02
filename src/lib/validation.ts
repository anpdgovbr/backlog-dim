/**
 * Funções utilitárias para validação server-side com Zod.
 *
 * Oferece helpers para padronizar respostas de erro (HTTP 400) e logar
 * mensagens de validação no servidor, além de auxiliar na leitura segura
 * do corpo JSON da requisição.
 *
 * @packageDocumentation
 */
import type { ZodIssue, ZodType } from "zod"

/**
 * Corpo de erro padronizado retornado quando a validação falha.
 */
export interface ApiValidationErrorBody {
  error: "Invalid input"
  details: Array<{
    path: string
    message: string
  }>
}

/**
 * Converte issues do Zod em um objeto de erro padronizado.
 *
 * @param issues - Lista de issues geradas pelo Zod.
 * @returns Objeto com `error` e `details` formatados.
 */
export function formatZodIssues(issues: ZodIssue[]): ApiValidationErrorBody {
  return {
    error: "Invalid input",
    details: issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    })),
  }
}

/**
 * Realiza o parse seguro do corpo JSON de uma requisição.
 *
 * Retorna `null` quando não foi possível ler o corpo ou quando o conteúdo
 * não é um objeto JSON válido.
 *
 * @param req - Requisição HTTP.
 */
export async function readJson(req: Request): Promise<unknown | null> {
  try {
    const data = await req.json()
    return data
  } catch {
    return null
  }
}

/**
 * Valida um `input` com `schema` do Zod, retornando um Response 400 padronizado
 * quando inválido. Em caso de falha, registra log no servidor com contexto.
 *
 * @typeParam T - Tipo inferido do schema Zod.
 * @param schema - Schema Zod para validação.
 * @param input - Valor a ser validado.
 * @param logContext - Mensagem opcional para contexto de log.
 */
export function validateOrBadRequest<T>(
  schema: ZodType<T>,
  input: unknown,
  logContext?: string
): { ok: true; data: T } | { ok: false; response: Response } {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    const body = formatZodIssues(parsed.error.issues)
    console.warn(
      `[validation] ${logContext ?? "input"} inválido:`,
      body.details.map((d) => `${d.path}: ${d.message}`).join("; ")
    )
    return { ok: false, response: Response.json(body, { status: 400 }) }
  }
  return { ok: true, data: parsed.data }
}
