
export function replaceNumbers(str: string): string {
  if (typeof str !== "string") return ""
    // Remove '-', '/', '\', substituindo por uma string vazia
  return str.replace(/[.\-\/]/g, "")
}
