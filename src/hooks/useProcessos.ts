// hooks/useProcessos.ts
import useSWR from "swr"

import type { BaseQueryParams, ProcessoOutput } from "@anpdgovbr/shared-types"

import { fetcher } from "@/lib/fetcher"

/**
 * Parâmetros aceitos pelo hook `useProcessos`.
 */
export interface UseProcessosParams extends Omit<BaseQueryParams, "orderBy"> {
  /** Filtra por responsável (user id) */
  responsavelUserId?: string
  orderBy?: string
}

/**
 * Resultado retornado por `useProcessos`.
 */
export interface UseProcessosResult {
  data: ProcessoOutput[]
  total: number
  isLoading: boolean
  error: unknown
}

/**
 * Hook para buscar processos paginados usando SWR.
 *
 * O hook monta a query string automaticamente a partir dos parâmetros
 * e consome a rota `/api/processos`.
 *
 * @example
 * const { data, total, isLoading } = useProcessos({ page: 1, pageSize: 20 })
 */
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
