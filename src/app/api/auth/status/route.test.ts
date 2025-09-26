import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Mock simples do NextResponse.json para testes unitários
vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) =>
      new Response(JSON.stringify(data), {
        ...(init ?? {}),
        headers: { "content-type": "application/json" },
      }),
  },
}))

import { GET } from "./route"

const ORIGINAL_ENV = { ...process.env }

describe("/api/auth/status GET", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("retorna 503 quando KEYCLOAK_ISSUER é inválido", async () => {
    process.env.KEYCLOAK_ISSUER = "not-a-url"
    const res = await GET()
    expect(res.status).toBe(503)
    const body = (await res.json()) as { ok: boolean; code: string }
    expect(body.ok).toBe(false)
    expect(body.code).toBe("CONFIG_INVALID")
  })

  it("retorna 503 quando clientId/secret ausentes", async () => {
    process.env.KEYCLOAK_ISSUER = "https://issuer.example"
    delete process.env.KEYCLOAK_CLIENT_ID
    delete process.env.KEYCLOAK_CLIENT_SECRET
    const res = await GET()
    expect(res.status).toBe(503)
    const body = (await res.json()) as { ok: boolean; code: string }
    expect(body.ok).toBe(false)
    expect(body.code).toBe("CONFIG_INCOMPLETE")
  })

  it("retorna 503 quando provider está indisponível", async () => {
    process.env.KEYCLOAK_ISSUER = "https://issuer.example"
    process.env.KEYCLOAK_CLIENT_ID = "client"
    process.env.KEYCLOAK_CLIENT_SECRET = "secret"

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("ko", { status: 500 }) as unknown as Response
    )

    const res = await GET()
    expect(res.status).toBe(503)
    const body = (await res.json()) as { ok: boolean; code: string }
    expect(body.ok).toBe(false)
    expect(body.code).toBe("PROVIDER_UNAVAILABLE")
  })

  it("retorna ok: true quando well-known é válido", async () => {
    process.env.KEYCLOAK_ISSUER = "https://issuer.example"
    process.env.KEYCLOAK_CLIENT_ID = "client"
    process.env.KEYCLOAK_CLIENT_SECRET = "secret"

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ authorization_endpoint: "https://issuer.example/auth" }),
        { status: 200, headers: { "content-type": "application/json" } }
      ) as unknown as Response
    )

    const res = await GET()
    expect(res.status).toBe(200)
    const body = (await res.json()) as { ok: boolean }
    expect(body.ok).toBe(true)
  })
})
