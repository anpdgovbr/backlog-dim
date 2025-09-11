import { beforeEach, describe, expect, it, vi } from "vitest"
import { createPrismaMock } from "@/test/prisma-mock"

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
const hoisted = { prisma, auditLog: vi.fn() }

// Mock withApi do pacote rbac-next via harness
vi.mock("@anpdgovbr/rbac-next", async () => {
  const { withApiRbacNextMockModule } = await import("@/test/route-harness")
  return withApiRbacNextMockModule()
})

vi.mock("@/rbac/server", () => ({
  getIdentity: { resolve: vi.fn() },
  rbacProvider: { getPermissionsByIdentity: vi.fn() },
  auditLog: vi.fn(),
}))

// prisma já mockado acima

import { POST } from "./route"
const rbac = await import("@/rbac/server")

describe("/api/permissoes/toggle POST", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("400 para body inválido", async () => {
    const req = new Request("http://local/api/permissoes/toggle", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(400)
  })

  it("404 quando perfil não encontrado", async () => {
    ;(
      hoisted.prisma.perfil.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(null)
    const req = new Request("http://local/api/permissoes/toggle", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        profileIdOrName: "Inexistente",
        acao: "Alterar",
        recurso: "Permissoes",
        permitido: true,
      }),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(404)
  })

  it("200 quando upsert realizado com sucesso (por id)", async () => {
    ;(
      hoisted.prisma.perfil.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      id: 12,
      nome: "Role",
    })
    ;(
      hoisted.prisma.permissao.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(null)
    ;(
      hoisted.prisma.permissao.upsert as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      id: 1,
      permitido: true,
    })
    const req = new Request("http://local/api/permissoes/toggle", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        profileIdOrName: 12,
        acao: "Alterar",
        recurso: "Permissoes",
        permitido: true,
      }),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(200)
    const json = (await res.json()) as { ok: boolean }
    expect(json.ok).toBe(true)
  })
})
