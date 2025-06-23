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

export function parseBRDateToISO(dateStr?: string): string | undefined {
  if (!dateStr) return undefined
  const [day, month, year] = dateStr.split("/")
  if (!day || !month || !year) return undefined

  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  const date = new Date(isoDate)
  return isNaN(date.getTime()) ? undefined : date.toISOString()
}

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
