import { describe, it, expect } from "vitest"
import { processoCreateSchema, processoUpdateSchema } from "./Processo.zod"

describe("Processo.zod", () => {
  it("create schema: validates minimal required and coerces types", () => {
    const nowIso = new Date().toISOString()
    const parsed = processoCreateSchema.safeParse({
      formaEntradaId: "1",
      responsavelId: 2,
      situacaoId: "3",
      dataEnvioPedido: nowIso,
      dataConclusao: null,
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.formaEntradaId).toBe(1)
      expect(parsed.data.responsavelId).toBe(2)
      expect(parsed.data.situacaoId).toBe(3)
      expect(parsed.data.temaRequerimento).toEqual([])
      expect(parsed.data.anonimo).toBeTypeOf("boolean")
      expect(parsed.data.dataEnvioPedido instanceof Date).toBe(true)
      expect(parsed.data.dataConclusao).toBeNull()
    }
  })

  it("update schema: allows nulls to clear optional fields", () => {
    const parsed = processoUpdateSchema.safeParse({
      requeridoId: null,
      encaminhamentoId: null,
      pedidoManifestacaoId: null,
      contatoPrevioId: null,
      evidenciaId: null,
      tipoReclamacaoId: null,
      processoStatusId: null,
      dataVencimento: null,
      dataEnvioPedido: null,
      dataConclusao: null,
      prazoPedido: null,
      tipoRequerimento: null,
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.requeridoId).toBeNull()
      expect(parsed.data.dataVencimento).toBeNull()
      expect(parsed.data.prazoPedido).toBeNull()
    }
  })
})
