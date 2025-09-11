import { describe, it, expect } from "vitest"

import { GET } from "./route"

describe("/api/health GET", () => {
  it("retorna status ok com headers corretos", async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toContain("application/json")
    expect(res.headers.get("cache-control")).toBe("no-store")
    const body = (await res.json()) as { status: string; timestamp: string }
    expect(body.status).toBe("ok")
    // timestamp deve ser uma ISOString válida
    expect(() => new Date(body.timestamp).toISOString()).not.toThrow()
  })
})
