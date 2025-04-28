import { mask, unmask } from "remask"

export const validateEmail = (email: string) => {
  if (email === "") return undefined
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email) ? undefined : "E-mail inválido"
}

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

export function validateTelefone(telefone: string): string | null {
  const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/
  if (!regex.test(telefone)) {
    return "Telefone inválido"
  }
  return null
}

/**
 * Formata uma string como CPF ou CNPJ baseado no número de dígitos.
 * @param value - String numérica contendo CPF (11 dígitos) ou CNPJ (14 dígitos)
 * @returns String formatada ou o valor original se não for válido
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
