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
const hoisted = { prisma }

// Mock withApi via harness compartilhado
vi.mock("@/lib/withApi", async () => {
  const { withApiMockModule } = await import("@/test/route-harness")
  return withApiMockModule()
})

// prisma já mockado acima

vi.mock("@/helpers/getOrRestoreByName", () => ({ getOrRestoreByName: vi.fn() }))

import { POST } from "./route"
const { getOrRestoreByName } = await import("@/helpers/getOrRestoreByName")
import { makeProcesso } from "@/test/factories"
import { mockTransactionOnce } from "@/test/prisma-mock"

describe("/api/importar-processos POST", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    ;(getOrRestoreByName as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 1,
    })
  })

  it("400 quando 'processos' não é array", async () => {
    const req = new Request("http://local/api/importar-processos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ processos: "x" }),
    })
    // transação não deve ser chamada
    ;(hoisted.prisma.$transaction as unknown as ReturnType<typeof vi.fn>).mockReset()
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(400)
  })

  it("200 com sucesso quando item novo", async () => {
    const tx = {
      processo: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(makeProcesso({ id: 10 })),
      },
    }
    mockTransactionOnce(
      hoisted.prisma as unknown as { $transaction: ReturnType<typeof vi.fn> },
      tx
    )

    const req = new Request("http://local/api/importar-processos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nomeArquivo: "imp.csv",
        processos: [
          {
            responsavelNome: "R1",
            numeroProcesso: "P202401-0001",
            dataCriacao: "01/01/2024",
            situacaoNome: "S1",
            formaEntradaNome: "FE1",
            anonimoStr: "não",
            requerenteNome: "ACME",
          },
        ],
      }),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(200)
    const json = (await res.json()) as { sucesso: number; falhas: string[] }
    expect(json.sucesso).toBe(1)
    expect(json.falhas.length).toBe(0)
    const createCall = (tx.processo.create as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0] as { data: Record<string, unknown> }
    expect(createCall.data.statusInterno).toBeDefined()
  })

  it("400 quando processo já existe (duplicado)", async () => {
    const tx = {
      processo: {
        findFirst: vi.fn().mockResolvedValue(makeProcesso({ id: 99 })),
        create: vi.fn(),
      },
    }
    mockTransactionOnce(
      hoisted.prisma as unknown as { $transaction: ReturnType<typeof vi.fn> },
      tx
    )

    const req = new Request("http://local/api/importar-processos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        processos: [
          {
            responsavelNome: "R1",
            numeroProcesso: "P-EXISTE",
            dataCriacao: "01/01/2024",
            situacaoNome: "S1",
            formaEntradaNome: "FE1",
            anonimoStr: "sim",
            requerenteNome: "ACME",
          },
        ],
      }),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(400)
    const json = (await res.json()) as { sucesso: number; falhas: string[] }
    expect(json.sucesso).toBe(0)
    expect(json.falhas.length).toBe(1)
  })

  it("usa statusInterno do payload quando fornecido", async () => {
    const tx = {
      processo: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(makeProcesso({ id: 11 })),
      },
    }
    mockTransactionOnce(
      hoisted.prisma as unknown as { $transaction: ReturnType<typeof vi.fn> },
      tx
    )

    const req = new Request("http://local/api/importar-processos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        processos: [
          {
            responsavelNome: "R1",
            numeroProcesso: "P202401-0002",
            dataCriacao: "01/01/2024",
            situacaoNome: "S1",
            formaEntradaNome: "FE1",
            anonimoStr: "não",
            requerenteNome: "ACME",
            statusInterno: "NOVO",
          },
        ],
      }),
    })
    const res = await POST(req as unknown as never)
    expect(res.status).toBe(200)
    const createCall = (tx.processo.create as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0] as { data: Record<string, unknown> }
    expect(createCall.data.statusInterno).toBeDefined()
  })
})
