// hooks/usePerfis.ts
import useSWR from "swr"

import type { PerfilDto } from "@anpdgovbr/shared-types"

import { fetcher } from "@/lib/fetcher"

/**
 * Hook: usePerfis
 *
 * Retorna a lista de perfis disponíveis no backend usando SWR para cache e revalidação.
 *
 * Comportamento:
 * - Faz GET em /api/perfis via `useSWR` e o `fetcher` compartilhado.
 * - Fornece os perfis (ou array vazio enquanto carrega), estado de carregamento, erro e função `mutate`.
 *
 * Retorno:
 * - perfis: PerfilDto[] — lista de perfis (padrão: []).
 * - isLoading: boolean — indica se a requisição está em andamento.
 * - error: unknown — objeto de erro, se houver.
 * - mutate: () => void — função para revalidar/atualizar os dados.
 *
 * Exemplo:
 * const { perfis, isLoading, error, mutate } = usePerfis()
 *
 * Observações:
 * - Este hook delega a chamada ao `fetcher` central para manter consistência nas requests.
 */
export function usePerfis() {
  const { data, error, isLoading, mutate } = useSWR<PerfilDto[]>("/api/perfis", fetcher)
  return {
    perfis: data ?? [],
    isLoading,
    error,
    mutate,
  }
}
