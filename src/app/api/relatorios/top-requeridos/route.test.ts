import { beforeEach, describe, expect, it, vi } from "vitest"

// Mock withApi via harness
vi.mock("@/lib/withApi", async () => {
  const { withApiMockModule } = await import("@/test/route-harness")
  return withApiMockModule()
})

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: { processo: {}, $transaction: vi.fn() },
}))
const { prisma } = await import("@/lib/prisma")
const { createPrismaMock } = await import("@/test/prisma-mock")
Object.assign(prisma, createPrismaMock())

import { GET } from "./route"

describe("/api/relatorios/top-requeridos GET", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    ;(globalThis as unknown as { fetch: unknown }).fetch = vi.fn()
    process.env.CONTROLADORES_API_URL = "https://api.example"
  })

  it("clampa limit e agrega dados do serviço externo", async () => {
    ;(
      prisma.processo.groupBy as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([
      { requeridoId: 10, _count: { requeridoId: 7 } },
      { requeridoId: 20, _count: { requeridoId: 5 } },
    ])
    ;(fetch as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 10, nome: "Ctrl 10" }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 20, nome: "Ctrl 20" }), { status: 200 })
      )

    const req = new Request("http://local/api/relatorios/top-requeridos?limit=9999")
    const res = await GET(req as unknown as never)
    expect(res.status).toBe(200)
    const json = (await res.json()) as Array<{ id: number; totalProcessos: number }>
    expect(json.length).toBe(2)
    const groupArg = (prisma.processo.groupBy as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0]
    expect(groupArg.take).toBe(100)
  })
})
