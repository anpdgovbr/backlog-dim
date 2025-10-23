import type { BaseQueryParams, PageResponseDto, SetorDto } from "@anpdgovbr/shared-types"

import { useApi } from "@/lib/api"

/**
 * Parâmetros para o hook useSetor.
 *
 * Estende BaseQueryParams com um filtro opcional `nome` que pode ser usado
 * para refinar a busca de setores no backend.
 *
 * Exemplos de campos herdados de BaseQueryParams:
 * - page
 * - pageSize
 * - search
 * - orderBy
 * - ascending
 */
export interface UseSetorParams extends BaseQueryParams {
  nome?: string
}

/**
 * Estrutura de retorno do hook useSetor.
 *
 * - data: lista de SetorDto retornada pela API (padrão: []).
 * - total: total de itens disponíveis no servidor (padrão: 0).
 * - isLoading: indicador de carregamento.
 * - error: erro ocorrido durante a requisição, quando houver.
 * - mutate: função para revalidar/manualmente atualizar os dados (SWR).
 */
export interface UseSetorResult {
  data: SetorDto[]
  totalElements: number
  page: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  error: unknown
  mutate: () => void
}

/**
 * Hook que busca setores com paginação e filtros via endpoint /api/setor.
 *
 * Internamente monta a query string (page, pageSize, search, orderBy, ascending)
 * e utiliza `useApi` (SWR) para obter os dados.
 *
 * @param params - Parâmetros de consulta (ver UseSetorParams).
 * @returns UseSetorResult com dados, total, estado de carregamento, erro e mutate.
 */
export function useSetor(params: UseSetorParams): UseSetorResult {
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

  const { data, error, isLoading, mutate } = useApi<PageResponseDto<SetorDto>>(key)

  return {
    data: data?.data ?? [],
    totalElements: data?.totalElements ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? pageSize,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    error,
    mutate,
  }
}
