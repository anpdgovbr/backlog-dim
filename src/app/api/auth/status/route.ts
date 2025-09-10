import { NextResponse } from "next/server"

/**
 * Verifica se a string fornecida é uma URL absoluta válida com protocolo HTTP ou HTTPS.
 *
 * @param url - A string a ser verificada; aceita undefined ou null.
 * @returns true se a string for uma URL absoluta com protocolo http: ou https:, caso contrário false.
 */
function isAbsoluteUrl(url?: string | null) {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * Tipo resultado da verificação do endpoint .well-known.
 *
 * - { ok: true } indica sucesso na validação.
 * - { ok: false; reason: string } indica falha com motivo legível.
 */
type CheckResult = { ok: true } | { ok: false; reason: string }

/**
 * Cria um sinal de aborto com timeout para uso em fetch/operações assíncronas.
 *
 * Tenta usar AbortSignal.timeout quando disponível (Node 18+). Caso contrário,
 * cria um AbortController e retorna também uma função `cancel` para limpar o timeout.
 *
 * @param ms - Tempo limite em milissegundos.
 * @returns Um objeto contendo opcionalmente `signal` (AbortSignal) e `cancel` (função para limpar o timeout).
 */
function createTimeoutSignal(ms: number): { signal?: AbortSignal; cancel?: () => void } {
  // Preferir AbortSignal.timeout quando disponível (Node 18+)
  if (typeof AbortSignal !== "undefined") {
    const maybe = AbortSignal as unknown as { timeout?: (ms: number) => AbortSignal }
    if (typeof maybe.timeout === "function") {
      return { signal: maybe.timeout(ms) }
    }
  }
  // Fallback com AbortController
  if (typeof AbortController !== "undefined") {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), ms)
    return { signal: controller.signal, cancel: () => clearTimeout(id) }
  }
  return {}
}

/**
 * Consulta o endpoint /.well-known/openid-configuration do issuer fornecido e valida
 * presença do campo `authorization_endpoint`.
 *
 * @param issuer - URL base do provedor de identidade (ex.: KEYCLOAK_ISSUER).
 * @returns Promise com CheckResult indicando sucesso ou motivo da falha.
 */
async function checkWellKnown(issuer: string): Promise<CheckResult> {
  const base = issuer.replace(/\/$/, "")
  const wellKnown = `${base}/.well-known/openid-configuration`
  try {
    const { signal, cancel } = createTimeoutSignal(2000)

    const res = await fetch(wellKnown, { method: "GET", signal })
    if (typeof cancel === "function") cancel()
    if (!res.ok) {
      return { ok: false, reason: `Falha ao consultar well-known (${res.status})` }
    }
    const json = (await res.json().catch(() => null)) as unknown
    const authEndpoint =
      json && typeof (json as Record<string, unknown>).authorization_endpoint === "string"
        ? ((json as Record<string, unknown>).authorization_endpoint as string)
        : undefined
    if (!authEndpoint) {
      return { ok: false, reason: "Resposta well-known inválida" }
    }
    return { ok: true as const }
  } catch (e) {
    console.error("Erro ao consultar well-known:", e)
    return { ok: false, reason: "Não foi possível contatar o Keycloak" }
  }
}

/**
 * Handler GET para /api/auth/status
 *
 * - Valida variáveis de ambiente necessárias (KEYCLOAK_ISSUER, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET).
 * - Verifica que o issuer é uma URL válida e que o provedor responde no endpoint .well-known.
 * - Retorna JSON com { ok: true } quando tudo estiver correto, ou objeto de erro com status 503 caso contrário.
 *
 * @returns NextResponse com o status de disponibilidade da configuração do provedor de identidade.
 */
export async function GET() {
  const issuer = process.env.KEYCLOAK_ISSUER
  const clientId = process.env.KEYCLOAK_CLIENT_ID
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET

  if (!isAbsoluteUrl(issuer)) {
    return NextResponse.json(
      {
        ok: false,
        code: "CONFIG_INVALID",
        message: "Configuração do provedor ausente ou inválida (KEYCLOAK_ISSUER).",
      },
      { status: 503 }
    )
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        ok: false,
        code: "CONFIG_INCOMPLETE",
        message: "Variáveis do cliente do Keycloak ausentes.",
      },
      { status: 503 }
    )
  }

  const issuerUrl = issuer as string
  const ping = await checkWellKnown(issuerUrl)
  if (!ping.ok) {
    return NextResponse.json(
      {
        ok: false,
        code: "PROVIDER_UNAVAILABLE",
        message: ping.reason ?? "Provedor de identidade indisponível.",
      },
      { status: 503 }
    )
  }

  return NextResponse.json({ ok: true })
}
