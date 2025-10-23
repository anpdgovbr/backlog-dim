"use client"

import type {
  BaseQueryParams,
  ControladorDto,
  PageResponseDto,
} from "@anpdgovbr/shared-types"

import { useApi } from "@/lib/api"
import { replaceNumbers } from "@/utils/stringUtils"

/**
 * Parâmetros aceitos pelo hook `useControladores`.
 *
 * Estende BaseQueryParams com filtros específicos para controladores:
 * - cnpj: permite filtrar pelo CNPJ (string, sem formatação esperada).
 * - nome: permite filtrar pelo nome do controlador.
 *
 * Exemplo:
 * const params: UseControladoresParams = { page: 1, pageSize: 20, cnpj: '12345678000199' }
 */
export interface UseControladoresParams extends BaseQueryParams {
  cnpj?: string
  nome?: string
}

/**
 * Resultado retornado por `useControladores`.
 *
 * - data: lista de ControladorDto (página atual).
 * - total: número total de itens disponíveis no backend.
 * - isLoading: indica carregamento inicial/atualização.
 * - error: qualquer erro ocorrido durante a busca.
 * - mutate: função para revalidar/atualizar os dados manualmente.
 * - getById: função auxiliar que busca um único controlador por ID.
 */
export interface UseControladoresResult {
  data: ControladorDto[]
  totalElements: number
  page: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  error: unknown
  mutate: () => Promise<PageResponseDto<ControladorDto> | undefined>
  getById: (id: string) => Promise<ControladorDto | null>
}

/**
 * Hook para consultar controladores com paginação e filtros.
 *
 * Recebe parâmetros de paginação/ordenação e filtros (cnpj, nome) e retorna
 * dados paginados via useApi (SWR).
 *
 * Observações:
 * - Substitui números no parâmetro `search` usando `replaceNumbers` antes da query.
 * - A rota utilizada é `/api/controladores`.
 *
 * Exemplo:
 * const { data, total, isLoading, getById } = useControladores({ page: 1, pageSize: 10, search: 'Empresa' })
 */
export function useControladores(params: UseControladoresParams): UseControladoresResult {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    orderBy = "nomeEmpresarial",
    ascending = true,
    cnpj,
    nome,
  } = params

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search: replaceNumbers(search),
    orderBy,
    ascending: String(ascending),
  })

  if (cnpj) query.set("cnpj", cnpj)
  if (nome) query.set("nome", nome)

  const key = `/api/controladores?${query.toString()}`

  const { data, error, isLoading, mutate } = useApi<PageResponseDto<ControladorDto>>(key)

  // 🛠 Função nova para buscar um único Controlador por ID
  /**
   * Busca um controlador individual por ID usando fetch direto ao endpoint.
   *
   * Retorna o ControladorDto quando encontrado ou null em caso de erro/404.
   * Erros são logados no console para auxiliar debugging no cliente.
   */
  async function getById(id: string): Promise<ControladorDto | null> {
    try {
      const resposta = await fetch(`/api/controladores/${id}`)
      if (!resposta.ok) {
        console.error(`Erro ao buscar Controlador id ${id}:`, resposta.status)
        return null
      }
      const data: ControladorDto = await resposta.json()
      return data
    } catch (err) {
      console.error("Erro inesperado ao buscar Controlador por ID:", err)
      return null
    }
  }

  return {
    data: data?.data ?? [],
    totalElements: data?.totalElements ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? pageSize,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    error,
    mutate,
    getById,
  }
}
