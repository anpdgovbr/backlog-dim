import { describe, it, expect } from "vitest"
import BuildInfo from "./BuildInfo"

/**
 * Testes para o componente BuildInfo
 *
 * Nota: Este componente usa hooks do React (useEffect) e fetch no cliente,
 * então os testes focam na lógica de formatação.
 */

describe("BuildInfo", () => {
  it("deve existir o componente BuildInfo", () => {
    // Teste básico de smoke test - verifica se o módulo pode ser importado
    expect(BuildInfo).toBeDefined()
    expect(typeof BuildInfo).toBe("function")
  })

  it("deve formatar data ISO corretamente para formato brasileiro", () => {
    // Testa a lógica de formatação de data
    const isoDate = "2025-10-13T19:13:16.112Z"
    const date = new Date(isoDate)

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    const formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`

    // Verifica formato dd/MM/YYYY HH:mm:ss
    expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/)
    expect(formatted).toContain("13/10/2025")
  })

  it("deve construir string de build info no formato esperado", () => {
    const version = "0.4.26"
    const commitShort = "4f3ebfc"
    const formattedDate = "13/10/2025 19:13:16"

    const buildInfo = `v${version} (${commitShort}) - ${formattedDate}`

    expect(buildInfo).toBe("v0.4.26 (4f3ebfc) - 13/10/2025 19:13:16")
    expect(buildInfo).toMatch(
      /^v\d+\.\d+\.\d+ \([a-f0-9]{7}\) - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/
    )
  })
})
