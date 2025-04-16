import { ProcessoOutput } from "@anpd/shared-types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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
