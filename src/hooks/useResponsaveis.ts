// hooks/useResponsaveis.ts
import useSWR from "swr"

import type { ResponsavelDto } from "@anpdgovbr/shared-types"

import { fetcher } from "@/lib/fetcher"

/**
 * Hook: useResponsaveis
 *
 * Recupera a lista de responsáveis do endpoint "/api/responsaveis" usando SWR.
 *
 * @remarks
 * O hook é intencionalmente simples e sem parâmetros; filtros ou paginação
 * devem ser aplicados por variações do hook ou na camada de apresentação.
 *
 * @returns Objeto com os seguintes campos:
 * - responsaveis: ResponsavelDto[] — lista de responsáveis (vazia durante carregamento)
 * - isLoading: boolean — indica se a requisição está em andamento
 * - error: unknown — erro retornado pela requisição, quando houver
 * - mutate: (data?: any, shouldRevalidate?: boolean) => Promise<any> — função SWR para revalidar/atualizar o cache
 *
 * @example
 * const { responsaveis, isLoading, error, mutate } = useResponsaveis()
 *
 * @see {@link https://swr.vercel.app/ | SWR}
 */
export function useResponsaveis() {
  const { data, error, isLoading, mutate } = useSWR<ResponsavelDto[]>(
    "/api/responsaveis",
    fetcher
  )
  return {
    responsaveis: data ?? [],
    isLoading,
    error,
    mutate,
  }
}
