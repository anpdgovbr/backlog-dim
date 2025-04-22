// lib/api.ts
import useSWR, { SWRConfiguration, mutate as globalMutate } from "swr"

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Erro ao buscar dados")
  return res.json()
}

export function useApi<Data>(path: string | null, config?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<Data>(path, fetcher, config)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export const mutateApi = globalMutate
