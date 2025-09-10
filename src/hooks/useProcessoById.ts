import useSWR from "swr"

import type { ProcessoOutput } from "@anpdgovbr/shared-types"

/**
 * Fetcher simples usado apenas neste hook.
 *
 * Observações:
 * - Mantido localmente para não alterar a API do projeto; pode ser substituído
 *   por `fetcher` central do projeto se desejado.
 *
 * @param url URL a ser requisitada
 * @returns Promise<any> com o corpo JSON da resposta
 */
const fetcher = (url: string) => fetch(url).then((res) => res.json())

/**
 * Hook: useProcessoById
 *
 * Retorna os dados de um processo identificados por ID utilizando SWR para cache
 * e revalidação automática.
 *
 * Parâmetros:
 * - id?: string — identificador do processo. Se não informado, a requisição não é feita.
 *
 * Retorno (objeto):
 * - processo: ProcessoOutput | undefined — dados do processo quando disponíveis.
 * - isLoading: boolean — indica se a requisição está em andamento.
 * - mutate: () => Promise<ProcessoOutput | undefined> — função para revalidar/atualizar os dados.
 * - error: unknown — objeto de erro quando a requisição falha.
 *
 * Exemplo:
 * const { processo, isLoading, error, mutate } = useProcessoById("123")
 *
 * Observações:
 * - Este é um hook do lado do cliente que depende de SWR.
 * - A string de URL usada é `/api/processos/${id}` seguindo os endpoints do projeto.
 */
export default function useProcessoById(id?: string) {
  const shouldFetch = Boolean(id)

  const { data, isLoading, mutate, error } = useSWR<ProcessoOutput>(
    shouldFetch ? `/api/processos/${id}` : null,
    fetcher
  )

  return {
    processo: data,
    isLoading,
    mutate,
    error,
  }
}
