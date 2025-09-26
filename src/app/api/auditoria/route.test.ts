import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock withApi via harness
vi.mock("@/lib/withApi", async () => {
  const { withApiMockModule } = await import("@/test/route-harness")
  return withApiMockModule()
})

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    auditLog: {},
    processo: {},
    user: {},
    perfil: {},
    permissao: {},
    $transaction: vi.fn(),
  },
}))
const { prisma } = await import("@/lib/prisma")
const { createPrismaMock } = await import("@/test/prisma-mock")
Object.assign(prisma, createPrismaMock())

import { GET } from "./route"

describe("/api/auditoria GET", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("aplica whitelist de orderBy e clamp de paginação", async () => {
    ;(prisma.auditLog.count as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      0
    )
    ;(
      prisma.auditLog.findMany as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([])

    const req = new Request(
      "http://local/api/auditoria?page=0&pageSize=9999&orderBy=foo&ascending=true"
    )
    const res = await GET(req as unknown as never)
    expect(res.status).toBe(200)
    const call = (prisma.auditLog.findMany as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0] as { orderBy: Record<string, string>; skip: number; take: number }
    expect(call).toBeTruthy()
    expect(Object.prototype.hasOwnProperty.call(call.orderBy, "criadoEm")).toBe(true)
    expect(call.skip).toBe(0)
    expect(call.take).toBe(100)
  })
})
