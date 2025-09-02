import { describe, it, expect } from "vitest"
import { z } from "zod"
import { formatZodIssues, validateOrBadRequest } from "./validation"

describe("validation helpers", () => {
  it("formatZodIssues maps issues to details", () => {
    const schema = z.object({ a: z.string().min(1) })
    const parsed = schema.safeParse({ a: "" })
    expect(parsed.success).toBe(false)
    const body = formatZodIssues(parsed.success ? [] : parsed.error.issues)
    expect(body.error).toBe("Invalid input")
    expect(body.details[0].path).toBe("a")
    expect(body.details[0].message.length).toBeGreaterThan(0)
  })

  it("validateOrBadRequest returns data on success", () => {
    const schema = z.object({ a: z.number() })
    const res = validateOrBadRequest(schema, { a: 1 })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data.a).toBe(1)
  })

  it("validateOrBadRequest returns 400 Response on failure", () => {
    const schema = z.object({ a: z.number() })
    const res = validateOrBadRequest(schema, { a: "x" })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.response.status).toBe(400)
  })
})
