/**
 * Adiciona uma quantidade de dias úteis (segunda a sexta) a uma data fornecida.
 *
 * Observações:
 * - Feriados não são considerados; apenas sábados e domingos são pulados.
 * - A função não modifica a instância `data` passada — retorna uma nova Date.
 *
 * @param data - Data inicial utilizada como referência. Deve ser um objeto Date válido.
 * @param dias - Número de dias úteis a adicionar (inteiro não-negativo).
 * @returns Nova instância de Date com os dias úteis adicionados.
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
 * Converte uma data no formato BR (dd/mm/yyyy) para uma ISO string.
 *
 * Comportamento:
 * - Se `dateStr` for falsy (undefined, empty) retorna undefined.
 * - Se a string não corresponder a um dia/mês/ano válidos, retorna undefined.
 * - A ISO retornada representa o início do dia em UTC (ex.: 'YYYY-MM-DDT00:00:00.000Z').
 *
 * @param dateStr - String no formato 'dd/mm/yyyy' ou undefined.
 * @returns ISO string ou undefined quando a entrada for inválida.
 *
 * @example
 * parseBRDateToISO('31/12/2024') // => '2024-12-31T00:00:00.000Z' (ou similar)
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
 * Normaliza diferentes representações de data para uma ISO string segura.
 *
 * Suporta:
 * - instâncias Date válidas,
 * - strings no formato BR tratadas por parseBRDateToISO.
 *
 * Retorna undefined quando a entrada for nula, inválida ou resultar em NaN.
 *
 * @param date - Date | string | null | undefined
 * @returns ISO string representando a data ou undefined se inválido.
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
 * Converte uma data para o formato usado por <input type="date">: 'YYYY-MM-DD'.
 *
 * Comportamento:
 * - Aceita Date ou string (parseável pelo construtor Date).
 * - Ajusta o timezone local subtraindo o offset para que a data local seja preservada
 *   ao gerar a string no formato ISO local (sem hora).
 * - Em caso de entrada inválida retorna string vazia.
 *
 * @param date - Date | string | null | undefined
 * @returns string no formato 'YYYY-MM-DD' ou '' quando inválido
 *
 * @example
 * toInputDateValue('2025-08-26T12:00:00Z') // => '2025-08-26'
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
