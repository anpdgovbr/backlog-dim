import { describe, it, expect } from "vitest"
import { permissaoCreateSchema, permissaoPatchSchema } from "./Permissao.zod"

describe("Permissao.zod", () => {
  it("permite criar por perfilNome", () => {
    const parsed = permissaoCreateSchema.safeParse({
      perfilNome: "Admin",
      acao: "Exibir",
      recurso: "Processo",
      permitido: true,
    })
    expect(parsed.success).toBe(true)
  })

  it("rejeita acao inválida", () => {
    const parsed = permissaoCreateSchema.safeParse({
      perfilNome: "Admin",
      acao: "X",
      recurso: "Processo",
      permitido: true,
    })
    expect(parsed.success).toBe(false)
  })

  it("patch: exige permitido boolean", () => {
    const ok = permissaoPatchSchema.safeParse({ permitido: false })
    expect(ok.success).toBe(true)
    const bad = permissaoPatchSchema.safeParse({ permitido: "nao" })
    expect(bad.success).toBe(false)
  })
})
