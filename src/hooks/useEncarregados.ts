"use client"

import type { EncarregadoDto } from "@anpdgovbr/shared-types"

import { useApi } from "@/lib/api"

export interface UseEncarregadosResult {
  data: EncarregadoDto[]
  isLoading: boolean
  error: unknown
  mutate: () => Promise<EncarregadoDto[] | undefined>
  getById: (id: string) => Promise<EncarregadoDto | null>
}

export function useEncarregados(): UseEncarregadosResult {
  const { data, error, isLoading, mutate } = useApi<EncarregadoDto[]>("/api/encarregados")

  async function getById(id: string): Promise<EncarregadoDto | null> {
    try {
      const resposta = await fetch(`/api/encarregados/${id}`)
      if (!resposta.ok) {
        console.error(`Erro ao buscar Encarregado id ${id}:`, resposta.status)
        return null
      }
      const payload = (await resposta.json()) as EncarregadoDto
      return payload
    } catch (err) {
      console.error("Erro inesperado ao buscar Encarregado por ID:", err)
      return null
    }
  }

  return {
    data: data ?? [],
    isLoading,
    error,
    mutate,
    getById,
  }
}
