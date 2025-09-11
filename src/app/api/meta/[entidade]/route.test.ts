import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock withApi via harness
vi.mock("@/lib/withApi", async () => {
  const { withApiMockModule } = await import("@/test/route-harness")
  return withApiMockModule()
})

// Mock prisma e allowedEntities
vi.mock("@/lib/prisma", () => ({
  prisma: {
    situacao: {},
    processo: {},
    user: {},
    perfil: {},
    permissao: {},
    auditLog: {},
    $transaction: vi.fn(),
  },
}))

import { GET } from "./route"
const { prisma } = await import("@/lib/prisma")
const { createPrismaMock } = await import("@/test/prisma-mock")
Object.assign(prisma, createPrismaMock())
// Garante que allowedEntities use o delegate mockado atual
const meta = await import("@/types/MetaEntidades")
;(meta.allowedEntities as unknown as Record<string, unknown>)["situacao"] =
  prisma.situacao

describe("/api/meta/[entidade] GET", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("aplica fallback de orderBy e clamp de paginação", async () => {
    ;(prisma.situacao.count as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      0
    )
    ;(
      prisma.situacao.findMany as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([])

    const req = new Request(
      "http://local/api/meta/situacao?page=0&pageSize=9999&orderBy=foo&ascending=false"
    )
    const res = await GET(req, { params: Promise.resolve({ entidade: "situacao" }) })
    expect(res.status).toBe(200)
    const call = (prisma.situacao.findMany as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0] as { orderBy: Record<string, string>; skip: number; take: number }
    expect(call).toBeTruthy()
    expect(Object.prototype.hasOwnProperty.call(call.orderBy, "nome")).toBe(true)
    expect(call.take).toBe(100)
    expect(call.skip).toBe(0)
    expect(call.orderBy["nome"]).toBe("desc")
  })
})
