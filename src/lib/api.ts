import type { SWRConfiguration } from "swr"
import useSWR, { mutate as globalMutate } from "swr"

const API_BASE_URL = process.env.NEXT_PUBLIC_CONTROLADORES_API_URL ?? ""

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Erro ao buscar dados")
  return res.json()
}

export function useApi<Data>(path: string | null, config?: SWRConfiguration) {
  const finalUrl = path
    ? path.startsWith("http") // Se já for URL absoluta, usa direto
      ? path
      : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`
    : null

  const { data, error, isLoading, mutate } = useSWR<Data>(finalUrl, fetcher, config)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export const mutateApi = globalMutate
