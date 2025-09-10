import { mask, unmask } from "remask"

/**
 * Valida o formato de um e-mail.
 *
 * Regras:
 * - Retorna undefined quando o e-mail é válido ou quando a string é vazia.
 * - Retorna uma mensagem de erro ("E-mail inválido") quando o formato é inválido.
 *
 * @param email - Texto do e-mail a ser validado.
 * @returns undefined | string - undefined se válido ou vazio; string com mensagem de erro caso contrário.
 */
export const validateEmail = (email: string) => {
  if (email === "") return undefined
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email) ? undefined : "E-mail inválido"
}

/**
 * Valida a URL de um site.
 *
 * Comportamento:
 * - Aceita strings vazias (retorna undefined).
 * - Normaliza valores sem esquema como 'example.com' para 'https://example.com' antes da validação.
 * - Aceita apenas protocolos http: ou https:.
 * - Verifica se o hostname possui pelo menos um ponto e não é apenas 'www.'.
 * - Em caso de erro de parsing, retorna "Site inválido" e registra no console.
 *
 * @param site - URL ou domínio do site a validar.
 * @returns string | undefined - undefined se válido ou vazio; string com mensagem de erro caso contrário.
 */
export const validateSite = (site: string): string | undefined => {
  if (!site.trim()) return undefined

  try {
    const normalizedSite = site.includes("://") ? site : `https://${site}`
    const url = new URL(normalizedSite)

    // Só aceita http ou https
    if (!["http:", "https:"].includes(url.protocol)) {
      return "O site deve começar com http:// ou https://"
    }

    // hostname precisa ter pelo menos um ponto e não pode ser só "www."
    if (!url.hostname.includes(".") || url.hostname === "www.") {
      return "Domínio do site inválido"
    }

    return undefined
  } catch (error) {
    console.error("Erro ao validar site:", error)
    return "Site inválido"
  }
}

/**
 * Valida o formato de um telefone brasileiro (DD + número).
 *
 * Aceita formatos com ou sem parênteses, espaços e hífen:
 * Exemplos válidos: "(11) 91234-5678", "11912345678", "11 91234-5678", "11-912345678"
 *
 * @param telefone - String contendo o telefone a validar.
 * @returns string | null - null se válido; string com mensagem de erro caso inválido.
 */
export function validateTelefone(telefone: string): string | null {
  const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/
  if (!regex.test(telefone)) {
    return "Telefone inválido"
  }
  return null
}

/**
 * Formata uma string como CPF ou CNPJ baseado no número de dígitos.
 *
 * Regras:
 * - Remove máscaras existentes antes de aplicar a formatação.
 * - Se possuir 14 dígitos, trata como CNPJ e aplica a máscara "99.999.999/9999-99".
 * - Se possuir 11 dígitos, trata como CPF e aplica a máscara "999.999.999-99".
 * - Caso contrário, retorna o valor original sem alteração.
 *
 * @param value - String numérica contendo CPF (11 dígitos) ou CNPJ (14 dígitos).
 * @returns string - Valor formatado conforme CPF/CNPJ ou o valor original se não corresponder.
 */
export function formatCpfCnpj(value: string): string {
  const numericValue = unmask(value || "")

  if (numericValue.length === 14) {
    // CNPJ
    return mask(numericValue, "99.999.999/9999-99")
  } else if (numericValue.length === 11) {
    // CPF
    return mask(numericValue, "999.999.999-99")
  } else {
    // Se não for CPF nem CNPJ padrão
    return value
  }
}
