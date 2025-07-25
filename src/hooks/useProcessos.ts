// hooks/useProcessos.ts
import useSWR from "swr"

import type { BaseQueryParams, ProcessoOutput } from "@anpdgovbr/shared-types"

import { fetcher } from "@/lib/fetcher"

interface UseProcessosParams extends BaseQueryParams {
  responsavelUserId?: string
}

interface UseProcessosResult {
  data: ProcessoOutput[]
  total: number
  isLoading: boolean
  error: unknown
}

export function useProcessos(params: UseProcessosParams): UseProcessosResult {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    orderBy = "dataCriacao",
    ascending = false,
    responsavelUserId,
  } = params

  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search,
    orderBy,
    ascending: ascending.toString(),
  })

  if (responsavelUserId) {
    query.set("responsavelUserId", responsavelUserId)
  }

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
