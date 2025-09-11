import { beforeEach, describe, expect, it, vi } from "vitest"
import { createPrismaMock } from "@/test/prisma-mock"

// Mock withApi via harness compartilhado
vi.mock("@/lib/withApi", async () => {
  const { withApiMockModule } = await import("@/test/route-harness")
  return withApiMockModule()
})

vi.mock("@/lib/prisma", () => ({
  prisma: {
    processo: {},
    user: {},
    perfil: {},
    permissao: {},
    auditLog: {},
    $transaction: vi.fn(),
  },
}))
const { prisma } = await import("@/lib/prisma")
Object.assign(prisma, createPrismaMock())

import { GET } from "./route"

describe("/api/processos/[id] GET", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("retorna 404 quando processo não encontrado", async () => {
    ;(
      prisma.processo.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(null)
    const req = new Request("http://local/api/processos/123")
    const res = await GET(req, { params: Promise.resolve({ id: "123" }) })
    expect(res.status).toBe(404)
  })

  it("retorna 404 quando processo está inativo", async () => {
    ;(
      prisma.processo.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      id: 10,
      active: false,
    })
    const req = new Request("http://local/api/processos/10")
    const res = await GET(req, { params: Promise.resolve({ id: "10" }) })
    expect(res.status).toBe(404)
  })
})
