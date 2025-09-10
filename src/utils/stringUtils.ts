/**
 * Remove caracteres comuns de formatação numérica de uma string.
 *
 * Esta função aceita uma string e retorna uma nova string com os caracteres
 * '.', '-', '/' removidos. Se o argumento fornecido não for uma string,
 * a função retorna uma string vazia.
 *
 * Uso típico: normalizar entradas que representam números ou identificadores
 * (ex.: CPF, CNPJ, registros) para facilitar validação ou comparação.
 *
 * @param str - A string de entrada que pode conter caracteres de formatação.
 * @returns A string resultante sem os caracteres '.', '-', '/' ou a string vazia
 *          se a entrada não for uma string.
 *
 * @example
 * replaceNumbers("123.456.789-00") // => "12345678900"
 */
export function replaceNumbers(str: string): string {
  if (typeof str !== "string") return ""
  // Remove '-', '/', '\', substituindo por uma string vazia
  return str.replace(/[.\-/]/g, "")
}
