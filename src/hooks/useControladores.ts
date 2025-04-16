import { fetcher } from "@/lib/fetcher"
import type { BaseQueryParams, ControladorDto } from "@anpd/shared-types"
import useSWR from "swr"

interface UseControladoresParams extends BaseQueryParams {
  cnpj?: string
  nome?: string
}

interface UseControladoresResult {
  data: ControladorDto[]
  total: number
  isLoading: boolean
  error: unknown
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
    page: page.toString(),
    pageSize: pageSize.toString(),
    search,
    orderBy,
    ascending: ascending.toString(),
  })

  if (cnpj) query.set("cnpj", cnpj)
  if (nome) query.set("nome", nome)

  const key = `/api/controladores?${query.toString()}`
  const { data, error, isLoading } = useSWR(key, fetcher)

  return {
    data: Array.isArray(data?.data) ? data.data : [],
    total: data?.total ?? 0,
    isLoading,
    error,
  }
}
