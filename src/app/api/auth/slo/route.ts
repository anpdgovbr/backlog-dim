import { NextResponse, type NextRequest } from "next/server"
import { registrarAuditoria } from "@/helpers/auditoria-server"
import { AcaoAuditoria } from "@anpdgovbr/shared-types"
import { getToken } from "next-auth/jwt"

/**
 * Gera a URL de Single Logout (SLO) do Keycloak e retorna como JSON.
 *
 * - Lê as variáveis de ambiente KEYCLOAK_ISSUER, KEYCLOAK_CLIENT_ID e NEXTAUTH_URL.
 * - Recupera o token do usuário via NextAuth para incluir `id_token_hint` quando disponível.
 * - Monta a URL de logout do Keycloak com os parâmetros necessários e retorna { url }.
 * - Registra uma entrada de auditoria (tabela "auth", contexto "slo-url") usando `registrarAuditoria`.
 *
 * @param req - Requisição NextRequest recebida pelo handler (usada também para capturar cabeçalhos para auditoria).
 * @returns NextResponse com JSON { url: string } em sucesso, ou { error: string } com status apropriado em erro.
 *
 * @remarks
 * - Retorna 500 quando as variáveis de ambiente obrigatórias não estão presentes.
 * - A função não realiza redirecionamento; apenas fornece a URL de logout para o cliente.
 * - Qualquer exceção é capturada e resulta em resposta JSON com status 500.
 */
export async function GET(req: NextRequest) {
  try {
    const issuer = process.env.KEYCLOAK_ISSUER
    const clientId = process.env.KEYCLOAK_CLIENT_ID
    const appUrl = process.env.NEXTAUTH_URL

    if (!issuer || !clientId || !appUrl) {
      return NextResponse.json(
        {
          error:
            "Configuração incompleta: defina KEYCLOAK_ISSUER, KEYCLOAK_CLIENT_ID e NEXTAUTH_URL.",
        },
        { status: 500 }
      )
    }

    const token = (await getToken({ req })) as
      | (Record<string, unknown> & {
          idToken?: string
        })
      | null
    const idToken = token?.idToken

    const base = issuer.replace(/\/$/, "")
    const endSession = `${base}/protocol/openid-connect/logout`
    const postLogout = `${appUrl.replace(/\/$/, "")}/`

    const params = new URLSearchParams({
      post_logout_redirect_uri: postLogout,
      client_id: clientId,
    })
    if (idToken) params.set("id_token_hint", idToken)

    const url = `${endSession}?${params.toString()}`

    // Registra auditoria da montagem de URL SLO (captura IP/UA via req.headers)
    const email = typeof token?.email === "string" ? token?.email : undefined

    await registrarAuditoria({
      tabela: "auth",
      acao: AcaoAuditoria.GET,
      email,
      contexto: "slo-url",
      req,
    })

    return NextResponse.json({ url })
  } catch (e) {
    console.error("Erro ao montar URL de logout:", e)
    return NextResponse.json({ error: "Falha ao montar URL de logout" }, { status: 500 })
  }
}
