import { beforeEach, describe, expect, it, vi } from "vitest"
import { createPrismaMock } from "@/test/prisma-mock"

// Mock withApi/withApiForId via harness compartilhado
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

import { PATCH } from "./route"

describe("/api/usuarios/[id] PATCH", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("retorna 400 quando nenhum campo é enviado", async () => {
    const req = new Request("http://local/api/usuarios/u-1", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: "u-1" }) })
    expect(res.status).toBe(400)
  })

  it("retorna 404 quando usuário não existe", async () => {
    ;(
      prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(null)

    const req = new Request("http://local/api/usuarios/u-404", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ responsavelId: 1 }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: "u-404" }) })
    expect(res.status).toBe(404)
  })

  it("atualiza quando dados válidos, retornando 200", async () => {
    const usuarioAntes = { id: "u-1", email: "t@e", nome: "Teste" }
    const usuarioDepois = { id: "u-1", email: "t@e", nome: "Teste", responsavelId: 2 }
    ;(
      prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(usuarioAntes)
    ;(prisma.user.update as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      usuarioDepois
    )

    const req = new Request("http://local/api/usuarios/u-1", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ responsavelId: 2 }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: "u-1" }) })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { success: boolean; usuario: object }
    expect(body.success).toBe(true)
  })
})
