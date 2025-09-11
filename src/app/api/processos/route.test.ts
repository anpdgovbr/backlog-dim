import { beforeEach, describe, expect, it, vi } from "vitest"
import { createPrismaMock } from "@/test/prisma-mock"

// Mock withApi via harness compartilhado
vi.mock("@/lib/withApi", async () => {
  const { withApiMockModule } = await import("@/test/route-harness")
  return withApiMockModule()
})

// Mock do prisma usado na rota
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

// Inicializa prisma mock real pós-hoist
const { prisma } = await import("@/lib/prisma")
Object.assign(prisma, createPrismaMock())

import { GET, POST } from "./route"

describe("/api/processos", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("POST cria processo e retorna 201 com numero gerado", async () => {
    // count para gerar PYYYYMM-0001
    ;(prisma.processo.count as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      0
    )
    // create retorna echo do data + id
    ;(
      prisma.processo.create as unknown as ReturnType<typeof vi.fn>
    ).mockImplementationOnce(async (args: unknown) => {
      const a = args as { data: Record<string, unknown> }
      return { id: 1, ...a.data }
    })

    const body = {
      requerente: "Empresa X",
      formaEntradaId: 1,
      responsavelId: 2,
      situacaoId: 3,
      temaRequerimento: ["t"],
    }
    const req = new Request("http://local/api/processos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })

    const res = await POST(req as unknown as never)
    expect(res.status).toBe(201)
    const json = (await res.json()) as { numero: string; dataCriacao: string }

    const now = new Date()
    const expectedPrefix = `P${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-0001`
    expect(json.numero).toBe(expectedPrefix)
  })

  it("POST retorna 400 quando payload inválido", async () => {
    const req = new Request("http://local/api/processos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(400)
  })

  it("POST retorna 500 em erro interno do prisma", async () => {
    ;(prisma.processo.count as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      0
    )
    ;(
      prisma.processo.create as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("DB down"))
    const req = new Request("http://local/api/processos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        requerente: "Empresa Z",
        formaEntradaId: 1,
        responsavelId: 2,
        situacaoId: 3,
      }),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(500)
  })

  it("GET lista processos com data e total", async () => {
    ;(prisma.processo.count as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      1
    )
    ;(
      prisma.processo.findMany as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([{ id: 1, numero: "P202401-0001", requerente: "Empresa X" }])
    const req = new Request(
      "http://local/api/processos?page=1&pageSize=10&orderBy=dataCriacao&ascending=true&search=emp",
      { method: "GET" }
    )
    const res = await GET(req as unknown as never)
    expect(res.status).toBe(200)
    const json = (await res.json()) as {
      data: Array<Record<string, unknown>>
      total: number
    }
    expect(Array.isArray(json.data)).toBe(true)
    expect(json.total).toBe(1)
  })
})
