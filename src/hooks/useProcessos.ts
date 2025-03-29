// hooks/useProcessos.ts
import { fetcher } from "@/lib/fetcher"
import { BaseQueryParams } from "@/types/BaseQueryParams"
import { ProcessoOutput } from "@/types/Processo"
import useSWR from "swr"

interface UseProcessosResult {
  data: ProcessoOutput[]
  total: number
  isLoading: boolean
  error: unknown
}

export function useProcessos(params: BaseQueryParams): UseProcessosResult {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    orderBy = "dataCriacao",
    ascending = false,
  } = params

  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search,
    orderBy,
    ascending: ascending.toString(),
  })

  const queryString = query.toString()
  const key = `/api/processos?${queryString}`
  const { data, error, isLoading } = useSWR(key, fetcher)

  return {
    data: Array.isArray(data?.data) ? data.data : [],
    total: data?.total ?? 0,
    isLoading,
    error,
  }
}
