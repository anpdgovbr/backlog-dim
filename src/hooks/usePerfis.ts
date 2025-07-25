// hooks/usePerfis.ts
import useSWR from "swr"

import type { PerfilDto } from "@anpdgovbr/shared-types"

import { fetcher } from "@/lib/fetcher"

export function usePerfis() {
  const { data, error, isLoading, mutate } = useSWR<PerfilDto[]>("/api/perfis", fetcher)
  return {
    perfis: data ?? [],
    isLoading,
    error,
    mutate,
  }
}
