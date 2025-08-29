/**
 * Adiciona dias úteis (segunda a sexta) a uma data.
 *
 * @param data Data inicial
 * @param dias Número de dias úteis a adicionar
 * @returns Nova instância de Date com os dias úteis adicionados
 *
 * @example
 * adicionarDiasUteis(new Date('2025-08-22'), 3) // pula fim de semana automaticamente
 */
export function adicionarDiasUteis(data: Date, dias: number): Date {
  const resultado = new Date(data)
  let adicionados = 0
  while (adicionados < dias) {
    resultado.setDate(resultado.getDate() + 1)
    const diaSemana = resultado.getDay()
    if (diaSemana !== 0 && diaSemana !== 6) {
      adicionados++
    }
  }
  return resultado
}

/**
 * Converte uma data em formato BR (dd/mm/yyyy) para ISO string.
 * Retorna `undefined` caso a string seja inválida.
 *
 * @example
 * parseBRDateToISO('31/12/2024') // '2024-12-31T00:00:00.000Z' (ou similar)
 */
export function parseBRDateToISO(dateStr?: string): string | undefined {
  if (!dateStr) return undefined
  const [day, month, year] = dateStr.split("/")
  if (!day || !month || !year) return undefined

  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  const date = new Date(isoDate)
  return isNaN(date.getTime()) ? undefined : date.toISOString()
}

/**
 * Converte uma data (string no formato BR ou Date) para ISO string segura.
 * Retorna `undefined` quando a entrada for inválida ou nula.
 */
export function safeToISO(date: string | Date | null | undefined): string | undefined {
  if (!date) return undefined
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? undefined : date.toISOString()
  }
  if (typeof date === "string") {
    return parseBRDateToISO(date)
  }
  return undefined
}

/**
 * Formata uma data para o valor esperado por campos <input type="date">.
 * Ajusta o timezone local para que a string retornada represente corretamente
 * a data local no formato YYYY-MM-DD.
 *
 * @example
 * toInputDateValue('2025-08-26T12:00:00Z') // '2025-08-26'
 */
export function toInputDateValue(date: string | Date | null | undefined): string {
  if (!date) {
    return ""
  }

  try {
    const dateObj = new Date(date)
    dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
    return dateObj.toISOString().split("T")[0]
  } catch (e) {
    console.error("Erro ao converter data para o formato de entrada:", e)
    return ""
  }
}
