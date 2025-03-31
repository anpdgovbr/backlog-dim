// hooks/useResponsaveis.ts
import { fetcher } from "@/lib/fetcher"
import { Responsavel } from "@/types/Responsavel"
import useSWR from "swr"

export function useResponsaveis() {
  const { data, error, isLoading, mutate } = useSWR<Responsavel[]>(
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
