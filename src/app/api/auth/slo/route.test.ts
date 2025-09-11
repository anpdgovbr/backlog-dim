import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Mock NextResponse.json
vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) =>
      new Response(JSON.stringify(data), {
        ...(init ?? {}),
        headers: { "content-type": "application/json" },
      }),
  },
}))

// Mock getToken do next-auth/jwt
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn().mockResolvedValue({ idToken: "IDTOKEN", email: "user@example.com" }),
}))

// Mock da auditoria
vi.mock("@/helpers/auditoria-server", () => ({
  registrarAuditoria: vi.fn().mockResolvedValue(undefined),
}))

import { GET } from "./route"
import { getToken } from "next-auth/jwt"

const ORIGINAL_ENV = { ...process.env }

describe("/api/auth/slo GET", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("retorna 500 quando env obrigatórios ausentes", async () => {
    delete process.env.KEYCLOAK_ISSUER
    delete process.env.KEYCLOAK_CLIENT_ID
    delete process.env.NEXTAUTH_URL
    const res = await GET(
      new Request("http://app.local/api/auth/slo") as unknown as never
    )
    expect(res.status).toBe(500)
    const body = (await res.json()) as { error: string }
    expect(body.error).toMatch(/Configuração incompleta/i)
  })

  it("gera URL de logout com id_token_hint quando disponível", async () => {
    process.env.KEYCLOAK_ISSUER = "https://kc.example"
    process.env.KEYCLOAK_CLIENT_ID = "client123"
    process.env.NEXTAUTH_URL = "https://app.example"

    // garante mock do token
    ;(getToken as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      idToken: "IDTOKEN",
      email: "user@example.com",
    })

    const req = new Request("https://app.example/api/auth/slo")
    const res = await GET(req as unknown as never)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { url: string }
    expect(body.url).toContain("https://kc.example/protocol/openid-connect/logout?")
    expect(body.url).toContain("client_id=client123")
    expect(body.url).toContain("post_logout_redirect_uri=https%3A%2F%2Fapp.example%2F")
    expect(body.url).toContain("id_token_hint=IDTOKEN")
  })
})
