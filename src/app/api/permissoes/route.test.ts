import { beforeEach, describe, expect, it, vi } from "vitest"
import { createPrismaMock } from "@/test/prisma-mock"

// Hoisted mocks
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
const hoisted = {
  prisma,
  rbacProvider: {
    getPermissionsByIdentity: vi.fn(),
  },
  getIdentity: {
    resolve: vi.fn(),
  },
  getPermissoesPorPerfil: vi.fn(),
}

// Mock withApi do pacote rbac-next via harness
vi.mock("@anpdgovbr/rbac-next", async () => {
  const { withApiRbacNextMockModule } = await import("@/test/route-harness")
  return withApiRbacNextMockModule()
})

vi.mock("@/rbac/server", () => ({
  rbacProvider: { getPermissionsByIdentity: vi.fn() },
  getIdentity: { resolve: vi.fn() },
}))

vi.mock("@anpdgovbr/rbac-prisma", () => ({ getPermissoesPorPerfil: vi.fn() }))

// prisma já mockado acima

import { GET, POST } from "./route"
const rbac = await import("@/rbac/server")
const rbacPrisma = await import("@anpdgovbr/rbac-prisma")
import { makePerfil } from "@/test/factories"

describe("/api/permissoes", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("GET sem perfil: retorna permissões do identity atual", async () => {
    ;(
      rbac.getIdentity.resolve as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      id: "u-1",
      email: "user@example",
    })
    ;(
      rbac.rbacProvider.getPermissionsByIdentity as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      Exibir: { Permissoes: true, Processo: false },
      Cadastrar: { Permissoes: true },
    })

    const res = await GET(new Request("http://local/api/permissoes"))
    expect(res.status).toBe(200)
    const list = (await res.json()) as Array<{
      acao: string
      recurso: string
      permitido: boolean
    }>
    const keys = list.map((r) => `${r.acao}:${r.recurso}`)
    expect(keys).toContain("Exibir:Permissoes")
    expect(keys).toContain("Cadastrar:Permissoes")
    expect(keys).not.toContain("Exibir:Processo")
  })

  it("GET com perfil numérico inexistente: 404", async () => {
    ;(
      hoisted.prisma.perfil.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(null)
    const res = await GET(new Request("http://local/api/permissoes?perfil=123"))
    expect(res.status).toBe(404)
  })

  it("GET com perfil por nome: retorna lista do provider prisma", async () => {
    ;(
      rbacPrisma.getPermissoesPorPerfil as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([{ acao: "Exibir", recurso: "Usuario", permitido: true }])
    const res = await GET(new Request("http://local/api/permissoes?perfil=Admin"))
    expect(res.status).toBe(200)
    const list = (await res.json()) as Array<{
      acao: string
      recurso: string
      permitido: boolean
    }>
    expect(list.length).toBe(1)
    expect(list[0].acao).toBe("Exibir")
    expect(list[0].recurso).toBe("Usuario")
  })

  it("POST cria/upsert permissão e retorna 201", async () => {
    ;(
      hoisted.prisma.perfil.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(makePerfil({ id: 10 }))
    ;(
      hoisted.prisma.permissao.upsert as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      id: 1,
      permitido: true,
    })

    const req = new Request("http://local/api/permissoes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        perfilNome: "Admin",
        acao: "Exibir",
        recurso: "Permissoes",
        permitido: true,
      }),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(201)
    const json = (await res.json()) as { id: number; permitido: boolean }
    expect(json.id).toBe(1)
    expect(json.permitido).toBe(true)
  })

  it("POST retorna 404 quando perfil não encontrado", async () => {
    ;(
      hoisted.prisma.perfil.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(null)
    const req = new Request("http://local/api/permissoes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        perfilNome: "Inexistente",
        acao: "Exibir",
        recurso: "Permissoes",
        permitido: true,
      }),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(404)
  })
})
