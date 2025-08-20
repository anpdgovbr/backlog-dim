"use client"

import { useEffect, useState } from "react"

/**
 * Hook para obter o ano atual de forma segura para SSR
 * Evita problemas de hidratação entre servidor e cliente
 */
export function useCurrentYear(): number {
  const [year, setYear] = useState<number>(2025) // Ano padrão para SSR

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return year
}
