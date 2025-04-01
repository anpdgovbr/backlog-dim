// hooks/usePerfis.ts
import { fetcher } from "@/lib/fetcher"
import { Perfil } from "@/types/Perfil"
import useSWR from "swr"

export function usePerfis() {
  const { data, error, isLoading, mutate } = useSWR<Perfil[]>("/api/perfis", fetcher)
  return {
    perfis: data ?? [],
    isLoading,
    error,
    mutate,
  }
}
