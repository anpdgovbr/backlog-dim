"use client"

import { useCallback } from "react"

export interface DadosCnpj {
  razao_social?: string
  email?: string
  telefone?: string
  site?: string
}

export function useBuscarCnpj() {
  const buscarCnpj = useCallback(async (cnpj: string): Promise<DadosCnpj | null> => {
    if (!cnpj || cnpj.length !== 14) return null

    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
      if (!res.ok) {
        // Se a API externa falhar, apenas ignora silenciosamente
        return null
      }

      const data = await res.json()
      return {
        razao_social: data.razao_social,
        email: data.email,
        telefone: data.telefone,
        site: data.site,
      }
    } catch {
      // Erros de rede também ignoramos silenciosamente
      return null
    }
  }, [])

  return { buscarCnpj }
}
