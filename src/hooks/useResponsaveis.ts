// hooks/useResponsaveis.ts
import useSWR from "swr"

import type { ResponsavelDto } from "@anpdgovbr/shared-types"

import { fetcher } from "@/lib/fetcher"

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
