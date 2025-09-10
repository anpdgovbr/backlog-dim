import type { JSX } from "react"

import Box from "@mui/material/Box"

/**
 * Gera uma chave estável (string) para um valor arbitrário.
 *
 * Regras:
 * - Para null/undefined e tipos primitivos retorna uma string com o tipo + valor.
 * - Para objetos que possuem propriedade `id` (string|number|bigint) usa `id:<valor>`.
 * - Tenta serializar via JSON.stringify tratando BigInt convertendo para string.
 * - Se a serialização falhar, usa Object.prototype.toString como fallback e, em último caso,
 *   retorna "unserializable".
 *
 * Uso: função utilitária interna usada para gerar keys únicas ao renderizar coleções,
 * evitando o uso de índices como chave em listas React.
 *
 * @internal
 * @param v - Valor arbitrário a ser convertido em chave estável
 * @returns Uma string estável única (ou o melhor fallback possível) representando `v`
 */
function keyForValue(v: unknown): string {
  // primitives (inclui null/undefined)
  if (v === null) return "null"
  if (v === undefined) return "undefined"

  const t = typeof v

  if (t === "string") return `string:${v as string}`
  if (t === "number") return `number:${String(v as number)}`
  if (t === "boolean") return `boolean:${String(v as boolean)}`
  if (t === "bigint") return `bigint:${String(v as bigint)}`
  if (t === "symbol") return `symbol:${String(v as symbol)}`
  if (t === "function") return `function:${String(v as Function)}`

  // objetos: priorizar id quando existir
  try {
    const obj = v as Record<string, unknown>
    if (
      obj &&
      (typeof obj.id === "string" ||
        typeof obj.id === "number" ||
        typeof obj.id === "bigint")
    ) {
      return `id:${String(obj.id)}`
    }
  } catch {
    /* ignore */
  }

  // fallback: JSON seguro (trata bigint)
  try {
    return `json:${JSON.stringify(
      v,
      (_k, value) => (typeof value === "bigint" ? String(value) : value),
      0
    )}`
  } catch {
    // último recurso
    try {
      return `toString:${Object.prototype.toString.call(v)}`
    } catch {
      return "unserializable"
    }
  }
}

/**
 * Renderiza um valor JSON-like com cores para facilitar leitura em UI.
 *
 * - Strings, números, booleanos, null, arrays e objetos recebem estilização distinta.
 * - Trata BigInt na serialização e tipos não-JSON-friendly (funções, símbolos).
 * - Para estruturas grandes ou desconhecidas realiza um safeStringify com fallback seguro.
 *
 * Exemplos:
 * - renderJsonColor("texto") => <span style="color:#a31515">"texto"</span>
 * - renderJsonColor({ a: 1 }) => JSX que mostra a chave "a" e o valor 1 colorido
 *
 * @param json - Valor a ser renderizado (pode ser qualquer coisa: primitivo, array, objeto, etc.)
 * @returns JSX.Element pronto para inserção em componentes React/MDI
 */
export function renderJsonColor(json: unknown): JSX.Element {
  if (typeof json === "string")
    return <span style={{ color: "#a31515" }}>&quot;{json}&quot;</span>

  if (typeof json === "number") return <span style={{ color: "#098658" }}>{json}</span>

  if (typeof json === "boolean")
    return <span style={{ color: "#0000ff" }}>{String(json)}</span>

  if (json === null) return <span style={{ color: "#008080" }}>null</span>

  if (Array.isArray(json)) {
    // Map para contar ocorrências da string gerada e garantir keys únicas sem usar índice
    const occurrences = new Map<string, number>()
    return (
      <span>
        [<br />
        <Box pl={2}>
          {json.map((v, idx) => {
            const base = keyForValue(v)
            const seen = occurrences.get(base) ?? 0
            occurrences.set(base, seen + 1)
            const key = `${base}#${seen}`
            return (
              <div key={key}>
                {renderJsonColor(v)}
                {idx < json.length - 1 ? "," : ""}
              </div>
            )
          })}
        </Box>
        ]
      </span>
    )
  }

  if (typeof json === "object" && json !== null) {
    const entries = Object.entries(json as Record<string, unknown>)
    return (
      <span>
        {"{"}
        <br />
        <Box pl={2}>
          {entries.map(([k, v], i) => (
            <div key={k}>
              <span style={{ color: "#000080" }}>&quot;{k}&quot;</span>:{" "}
              {renderJsonColor(v)}
              {i < entries.length - 1 ? "," : ""}
            </div>
          ))}
        </Box>
        {"}"}
      </span>
    )
  }

  // Novos tratamentos explícitos para tipos não-JSON-friendly
  if (json === undefined) return <span style={{ color: "#808080" }}>undefined</span>

  if (typeof json === "function")
    return <span style={{ color: "#800080" }}>{String(json)}</span>

  if (typeof json === "symbol")
    return <span style={{ color: "#800080" }}>{String(json)}</span>

  // Safe stringify com fallback: evita "[object Object]" e cuida de BigInt/erros
  const safeStringify = (v: unknown): string => {
    try {
      // JSON.stringify não aceita BigInt; convertemos para string nesse caso
      return (
        JSON.stringify(
          v,
          (_key, value) => (typeof value === "bigint" ? String(value) : value),
          2
        ) ?? String(v)
      )
    } catch {
      try {
        return String(v)
      } catch {
        return "<unserializable>"
      }
    }
  }

  const serialized = safeStringify(json)

  return (
    <Box component="span" sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
      {serialized}
    </Box>
  )
}
