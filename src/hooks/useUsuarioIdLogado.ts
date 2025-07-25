"use client"

import useSWR from "swr"

import { useSession } from "next-auth/react"

import { fetcher } from "@/lib/fetcher"

export function useUsuarioIdLogado() {
  const { data: session } = useSession()
  const email = session?.user?.email

  const { data, error, isLoading } = useSWR(
    email ? `/api/usuarios/email/${email}` : null,
    fetcher
  )

  return {
    userId: data?.id ?? null,
    loading: isLoading,
    error,
  }
}
