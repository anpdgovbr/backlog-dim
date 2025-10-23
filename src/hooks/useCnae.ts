"use client"

import type { BaseQueryParams, CnaeDto, PageResponseDto } from "@anpdgovbr/shared-types"

import { useApi } from "@/lib/api"

export interface UseCnaeParams extends BaseQueryParams {
  code?: string
  nome?: string
}

export interface UseCnaeResult {
  data: CnaeDto[]
  totalElements: number
  page: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  error: unknown
  mutate: () => Promise<void | PageResponseDto<CnaeDto> | undefined>
  getById: (id: string) => Promise<CnaeDto | null>
}

export function useCnae(params: UseCnaeParams): UseCnaeResult {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    orderBy = "codigo",
    ascending = true,
  } = params

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    orderBy,
    ascending: String(ascending),
  })

  const key = `/api/cnaes?${query.toString()}`

  const { data, error, isLoading, mutate } = useApi<PageResponseDto<CnaeDto>>(key)

  // 🔥 Nova função para buscar um CNAE específico por ID
  async function getById(id: string): Promise<CnaeDto | null> {
    try {
      const resposta = await fetch(`/api/cnaes/${id}`)
      if (!resposta.ok) {
        console.error(`Erro ao buscar CNAE id ${id}:`, resposta.status)
        return null
      }
      const data: CnaeDto = await resposta.json()
      return data
    } catch (err) {
      console.error("Erro inesperado ao buscar CNAE por ID:", err)
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
