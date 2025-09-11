import { beforeEach, describe, expect, it, vi } from "vitest"

// Mock getServerSession
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { email: "u@example" } }),
}))

// Mock authOptions import (não usado ativamente na verificação por email)
vi.mock("@/config/next-auth.config", () => ({ default: {} }))

// Mock prisma
vi.mock("@/lib/prisma", () => ({ prisma: { user: {}, processo: {} } }))
const { prisma } = await import("@/lib/prisma")
const { createPrismaMock } = await import("@/test/prisma-mock")
Object.assign(prisma, createPrismaMock())

import { GET } from "./route"

describe("/api/relatorios/processos-dashboard GET", () => {
  it("retorna estatísticas agregadas", async () => {
    ;(
      prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      id: "u1",
      responsavel: { id: 9 },
    })

    const now = new Date()
    const past = new Date(now.getTime() - 86400000)
    ;(prisma.processo.count as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      2
    )
    ;(
      prisma.processo.findMany as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([
      {
        dataCriacao: now,
        dataVencimento: past,
        responsavel: { userId: "u1" },
        statusInterno: "NOVO",
        tipoRequerimento: "PETICAO_TITULAR",
        temaRequerimento: ["Tema A", "TEMA a"],
      },
      {
        dataCriacao: past,
        dataVencimento: null,
        responsavel: { userId: "u2" },
        statusInterno: "PROCESSADO",
        tipoRequerimento: "DENUNCIA_LGPD",
        temaRequerimento: ["Tema B"],
      },
    ])

    const res = await GET()
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      total: number
      porStatusInterno: Record<string, number>
      porTipoRequerimento: Record<string, number>
      topTemas: Array<{ tema: string; total: number }>
    }
    expect(body.total).toBeGreaterThanOrEqual(0)
    expect(body.porStatusInterno.NOVO).toBeGreaterThanOrEqual(0)
    expect(
      body.porTipoRequerimento.peticao_titular ??
        body.porTipoRequerimento["peticao_titular"]
    ).not.toBeUndefined()
    expect(Array.isArray(body.topTemas)).toBe(true)
  })
})
