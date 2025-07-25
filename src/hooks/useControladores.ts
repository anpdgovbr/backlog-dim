"use client"

import type { BaseQueryParams, ControladorDto } from "@anpdgovbr/shared-types"

import { useApi } from "@/lib/api"
import { replaceNumbers } from "@/utils/stringUtils"

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
  getById: (id: number) => Promise<ControladorDto | null>
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
    search: replaceNumbers(search),
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

  // 🛠 Função nova para buscar um único Controlador por ID
  async function getById(id: number): Promise<ControladorDto | null> {
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
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
    getById,
  }
}
