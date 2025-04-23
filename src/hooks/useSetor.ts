import { useApi } from "@/lib/api"
import type { BaseQueryParams, SetorDto } from "@anpd/shared-types"

interface UseControladoresParams extends BaseQueryParams {
  cnpj?: string
  nome?: string
}

interface UseSetorResult {
  data: SetorDto[]
  total: number
  isLoading: boolean
  error: unknown
  mutate: () => void
}

export function useSetor(params: UseControladoresParams): UseSetorResult {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    orderBy = "nome",
    ascending = true,
  } = params

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    orderBy,
    ascending: String(ascending),
  })

  const key = `/api/setor?${query.toString()}`

  const { data, error, isLoading, mutate } = useApi<{
    data: SetorDto[]
    total: number
  }>(key)

  return {
    data: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
  }
}
