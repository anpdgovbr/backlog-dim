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
  return `${baseUrl}/${sanitizedPath}`
}

/**
 * Tenta interpretar a resposta como JSON retornando `null` quando o corpo está vazio
 * ou inválido.
 */
export async function parseControladoresJson<T>(response: Response): Promise<T | null> {
  const raw = await response.text()
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    console.error("Falha ao interpretar JSON da API de Controladores:", error)
    return null
  }
}
