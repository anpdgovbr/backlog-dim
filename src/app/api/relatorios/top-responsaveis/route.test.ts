import { beforeEach, describe, expect, it, vi } from "vitest"

// Mock withApi via harness
vi.mock("@/lib/withApi", async () => {
  const { withApiMockModule } = await import("@/test/route-harness")
  return withApiMockModule()
})

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: { processo: {}, responsavel: {}, $transaction: vi.fn() },
}))
const { prisma } = await import("@/lib/prisma")
const { createPrismaMock } = await import("@/test/prisma-mock")
Object.assign(prisma, createPrismaMock())

import { GET } from "./route"

describe("/api/relatorios/top-responsaveis GET", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("clampa limit em 100 e retorna lista ordenada", async () => {
    ;(
      prisma.processo.groupBy as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([
      { responsavelId: 1, _count: { responsavelId: 5 } },
      { responsavelId: 2, _count: { responsavelId: 3 } },
    ])
    ;(
      prisma.responsavel.findMany as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([
      { id: 1, nome: "A", userId: "u1", active: true },
      { id: 2, nome: "B", userId: null, active: true },
    ])

    const req = new Request("http://local/api/relatorios/top-responsaveis?limit=1000")
    const res = await GET(req as unknown as never)
    expect(res.status).toBe(200)
    const json = (await res.json()) as Array<{ id: number; totalProcessos: number }>
    expect(json.length).toBe(2)
    expect(json[0].totalProcessos).toBeGreaterThanOrEqual(json[1].totalProcessos)
    const groupArg = (prisma.processo.groupBy as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0]
    expect(groupArg.take).toBe(100)
  })
})
