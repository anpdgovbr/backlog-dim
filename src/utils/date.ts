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
