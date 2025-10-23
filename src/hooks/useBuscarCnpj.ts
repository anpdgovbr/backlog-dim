"use client"

import { useCallback } from "react"

/**
 * Dados retornados pela consulta de CNPJ.
 *
 * Campos opcionais conforme a resposta da API BrasilAPI.
 *
 * @property razao_social - Razão social da pessoa jurídica (quando disponível).
 * @property email - E-mail de contato (quando disponível).
 * @property telefone - Telefone de contato (quando disponível).
 * @property site - Site/URL da organização (quando disponível).
 */
export interface DadosCnpj {
  razao_social?: string
  nome_fantasia?: string
  email?: string
  telefone?: string
  site?: string
}

/**
 * Hook para buscar informações públicas de pessoa jurídica a partir do CNPJ.
 *
 * Observações importantes:
 * - Recebe CNPJ no formato numérico (14 dígitos). Se o CNPJ for inválido,
 *   a função retornará null imediatamente.
 * - Usa a BrasilAPI (https://brasilapi.com.br/) para obter os dados e, em caso
 *   de falha da API ou erro de rede, retorna null silenciosamente para não quebrar
 *   fluxos de preenchimento automático.
 * - Este hook roda no cliente ("use client") e expõe apenas a função `buscarCnpj`.
 *
 * @returns Readonly<{ buscarCnpj: (cnpj: string) => Promise<DadosCnpj | null> }>
 */
export function useBuscarCnpj() {
  /**
   * Consulta a BrasilAPI para obter dados do CNPJ informado.
   *
   * @param cnpj - CNPJ em formato numérico (somente dígitos, 14 caracteres).
   * @returns Promise que resolve para DadosCnpj ou null (quando inválido ou em caso de erro).
   */
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
        nome_fantasia: data.nome_fantasia,
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
