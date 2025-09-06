import { NextResponse, type NextRequest } from "next/server"
import { registrarAuditoria } from "@/helpers/auditoria-server"
import type { AcaoAuditoria } from "@anpdgovbr/shared-types"
import { getToken } from "next-auth/jwt"

/**
 * Retorna a URL de logout do Keycloak (SLO) baseada nas variáveis de ambiente
 * e, quando disponível, inclui `id_token_hint` do JWT do NextAuth.
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
      acao: "GET" as unknown as AcaoAuditoria,
      email,
      contexto: "slo-url",
      req,
    })

    return NextResponse.json({ url })
  } catch (e) {
    return NextResponse.json({ error: "Falha ao montar URL de logout" }, { status: 500 })
  }
}
