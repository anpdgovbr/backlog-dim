// hooks/useResponsaveis.ts
import { fetcher } from "@/lib/fetcher"
import { ResponsavelDto } from "@anpd/shared-types"
import useSWR from "swr"

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
