"use client"

import { useEffect, useState } from "react"

/**
 * Hook: useCurrentYear
 *
 * Fornece o ano atual de forma segura em aplicações Next.js que utilizam SSR/SSG.
 *
 * Propósito:
 * - Evitar mismatches de hidratação entre servidor e cliente ao renderizar o ano.
 *
 * Comportamento:
 * - Inicializa com um valor padrão estável durante a renderização no servidor
 *   (no código atual: 2025) para manter o markup consistente.
 * - No primeiro efeito do cliente, atualiza o estado para new Date().getFullYear().
 *
 * Retorno:
 * - number — o ano atual (ex.: 2025, 2026, ...).
 *
 * Exemplo:
 * const year = useCurrentYear()
 *
 * Observações:
 * - Este é um hook do lado do cliente (arquivo com "use client").
 */
export function useCurrentYear(): number {
  const [year, setYear] = useState<number>(2025) // Ano padrão para SSR

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return year
}
