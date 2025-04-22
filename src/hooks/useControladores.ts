import { useApi } from "@/lib/api"
import type { BaseQueryParams, ControladorDto } from "@anpd/shared-types"

interface UseControladoresParams extends BaseQueryParams {
  cnpj?: string
  nome?: string
}

interface UseControladoresResult {
  data: ControladorDto[]
  total: number
  isLoading: boolean
  error: unknown
  mutate: () => void
}

export function useControladores(params: UseControladoresParams): UseControladoresResult {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    orderBy = "nome",
    ascending = true,
    cnpj,
    nome,
  } = params

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    orderBy,
    ascending: String(ascending),
  })

  if (cnpj) query.set("cnpj", cnpj)
  if (nome) query.set("nome", nome)

  const key = `/api/controladores?${query.toString()}`

  const { data, error, isLoading, mutate } = useApi<{
    data: ControladorDto[]
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
