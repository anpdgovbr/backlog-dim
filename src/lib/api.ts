import type { SWRConfiguration } from "swr"
import useSWR, { mutate as globalMutate } from "swr"

/**
 * URL base para chamadas externas configuradas via env.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_CONTROLADORES_API_URL ?? ""

/**
 * Fetcher padrão usado pelo SWR.
 *
 * Lança um erro quando a resposta não é OK (status >= 400).
 *
 * @example
 * const data = await fetcher('/api/hello')
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Erro ao buscar dados")
  return res.json()
}

/**
 * Hook SWR para chamadas de API com construção automática da URL.
 *
 * - Se `path` começar com `/api/` é considerada rota interna.
 * - Se começar com `http` é considerada URL absoluta.
 * - Caso contrário, prefixa com `API_BASE_URL`.
 *
 * @param path Caminho relativo ou URL absoluta. Se `null`, o hook não fará fetch.
 * @param config Configuração adicional para o SWR.
 * @returns Um objeto com `data`, `isLoading`, `error` e `mutate`.
 *
 * @example
 * const { data, isLoading } = useApi('/processos')
 */
export function useApi<Data>(path: string | null, config?: SWRConfiguration) {
  let finalUrl: string | null = null
  if (path) {
    if (path.startsWith("/api/")) {
      finalUrl = path // rota interna
    } else if (path.startsWith("http")) {
      finalUrl = path // URL absoluta
    } else {
      finalUrl = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`
    }
  }

  const { data, error, isLoading, mutate } = useSWR<Data>(finalUrl, fetcher, config)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

/**
 * Função para mutação global via SWR (reexport do mutate do SWR).
 */
export const mutateApi = globalMutate
