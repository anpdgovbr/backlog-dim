"use client"

import type { BaseQueryParams, CnaeDto } from "@anpdgovbr/shared-types"

import { useApi } from "@/lib/api"

interface UseCnaeParams extends BaseQueryParams {
  code?: string
  nome?: string
}

interface UseCnaeResult {
  data: CnaeDto[]
  total: number
  isLoading: boolean
  error: unknown
  mutate: () => void
  getById: (id: number) => Promise<CnaeDto | null>
}

export function useCnae(params: UseCnaeParams): UseCnaeResult {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    orderBy = "code",
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

  const { data, error, isLoading, mutate } = useApi<{
    data: CnaeDto[]
    total: number
  }>(key)

  // 🔥 Nova função para buscar um CNAE específico por ID
  async function getById(id: number): Promise<CnaeDto | null> {
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
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
    getById,
  }
}
