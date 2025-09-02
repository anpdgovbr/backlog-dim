import { describe, it, expect } from "vitest"
import { metaCreateSchema, metaUpdateSchema, metaDeleteSchema } from "./Meta.zod"

describe("Meta.zod", () => {
  it("create: exige nome", () => {
    const ok = metaCreateSchema.safeParse({ nome: "Situacao Nova" })
    expect(ok.success).toBe(true)
    const bad = metaCreateSchema.safeParse({ nome: "" })
    expect(bad.success).toBe(false)
  })

  it("update: exige id e nome validos", () => {
    const ok = metaUpdateSchema.safeParse({ id: "1", nome: "Atualizado" })
    expect(ok.success).toBe(true)
    const bad = metaUpdateSchema.safeParse({ id: 0, nome: "Atualizado" })
    expect(bad.success).toBe(false)
  })

  it("delete: exige id positivo", () => {
    const ok = metaDeleteSchema.safeParse({ id: 1 })
    expect(ok.success).toBe(true)
    const bad = metaDeleteSchema.safeParse({ id: 0 })
    expect(bad.success).toBe(false)
  })
})
