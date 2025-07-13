// hooks/usePerfis.ts
import { fetcher } from "@/lib/fetcher"
import type { PerfilDto } from "@anpd/shared-types"
import useSWR from "swr"

export function usePerfis() {
  const { data, error, isLoading, mutate } = useSWR<PerfilDto[]>("/api/perfis", fetcher)
  return {
    perfis: data ?? [],
    isLoading,
    error,
    mutate,
  }
}
