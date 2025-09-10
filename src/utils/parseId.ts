/**
 * Converte um valor desconhecido para um ID numérico ou `null`.
 *
 * Regras:
 * - Valores `""`, `undefined` ou `null` retornam `null`.
 * - Valores convertíveis para número (ex.: `"123"`, `123`) retornam o número.
 * - Valores não numéricos ou que produzem `NaN` retornam `null`.
 *
 * Uso típico: normalizar parâmetros (ex.: query params, inputs) que representam
 * identificadores antes de usar em consultas ao banco.
 *
 * @param val - Valor de entrada de tipo desconhecido que será interpretado como ID.
 * @returns O ID numérico quando válido, ou `null` caso o valor seja vazio/inválido.
 *
 * @example
 * parseId("42") // => 42
 * parseId(0)    // => 0
 * parseId("")   // => null
 * parseId("abc")// => null
 */
export const parseId = (val: unknown): number | null => {
  if (val === "" || val === undefined || val === null) return null

  const num = Number(val)
  return isNaN(num) ? null : num
}
