const RAW_BASE_URL = process.env.CONTROLADORES_API_URL ?? "http://localhost:8082/api"

const baseUrl = RAW_BASE_URL.endsWith("/") ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL

/**
 * Constrói a URL completa para a API de controladores (Quarkus).
 *
 * @param path - Caminho relativo (ex.: `/controlador`, `controlador/123`).
 * @returns URL completa incluindo o host configurado via env.
 */
export function getControladoresApiUrl(path: string): string {
  const sanitizedPath = path.startsWith("/") ? path.slice(1) : path
  const full = `${baseUrl}/${sanitizedPath}`

  // 🔍 log temporário — sempre exibe o endereço usado
  console.warn(
    "🔍 [getControladoresApiUrl] CONTROLADORES_API_URL =",
    process.env.CONTROLADORES_API_URL
  )
  console.warn("🔍 [getControladoresApiUrl] URL final:", full)

  return full
}

/**
 * Tenta interpretar a resposta como JSON retornando `null` quando o corpo está vazio
 * ou inválido.
 */
export async function parseControladoresJson<T>(response: Response): Promise<T | null> {
  console.warn("🔍 [parseControladoresJson] URL:", response.url)
  console.warn("🔍 [parseControladoresJson] bodyUsed ANTES:", response.bodyUsed)

  const raw = await response.text()

  console.warn("🔍 [parseControladoresJson] bodyUsed DEPOIS:", response.bodyUsed)
  console.warn("🔍 [parseControladoresJson] Tamanho da resposta:", raw.length, "bytes")
  console.warn("🔍 [parseControladoresJson] Conteúdo completo:", raw)

  if (!raw) {
    console.warn("⚠️ [parseControladoresJson] Resposta vazia!")
    return null
  }

  try {
    const parsed = JSON.parse(raw) as T
    console.warn("✅ [parseControladoresJson] JSON parseado com sucesso")
    if (parsed && typeof parsed === "object" && "data" in parsed) {
      console.warn(
        "🔍 [parseControladoresJson] Array data tem",
        (parsed as { data: unknown[] }).data?.length ?? 0,
        "itens"
      )
    }
    return parsed
  } catch (error) {
    // 🔍 também loga a origem da falha e preview da resposta
    console.error("❌ Falha ao interpretar JSON da API de Controladores:", error)
    console.error("📄 Corpo recebido (início):", raw.slice(0, 200))
    console.error("📡 URL da requisição:", response.url)
    return null
  }
}
