import Papa from "papaparse"

export const COLUMN_MAP = {
  obrigatorias: {
    responsavelNome: [
      "responsável",
      "nomeResponsável, responsavel",
      "responsável pelo atendimento",
    ],
    numeroProcesso: [
      "numero",
      "numero Processo",
      "Número processo",
      "NumeroProcesso",
      "N? do protocolo",
      "protocolo",
    ],
    dataCriacao: [
      "dataCriacao",
      "data de criacao(dia)",
      "dataDeCriacao",
      "data",
      "criacao",
    ],
    situacaoNome: ["Status", "status", "situacao", "Situacao"],
    formaEntradaNome: [
      "Tipo de solicitação",
      "tipo de solicitação",
      "tipo de soliticacao",
      "tipo",
      "solicitacao",
    ],
    anonimoStr: [
      "Denúncia anônima?",
      "denúncia anonima",
      "denuncia anonima",
      "anonimo",
      "anonima",
    ],
    requerenteNome: [
      "Ticket> Solicitante",
      "Solicitante",
      "solicitante",
      "Requerente",
      "requerente",
      "Ticket",
      "ticket",
    ],
  },
  //Array de campos opcionais
  // opcionais: {
  //   formaEntrada:[].
  // }
}

// Normalização de cabeçalho
function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\-\s]+/g, "")
    .toLowerCase()
}

function mapHeaders(headers: string[]): Record<string, string> {
  //Headers mapeados
  const mapped: Record<string, string> = {}
  //Headers normalizados
  const normalizedHeaders = headers.map(normalize)

  //Loop para armazenar cabeçalho de colunas
  for (const header of normalizedHeaders) {
    for (const [field, variations] of Object.entries(COLUMN_MAP.obrigatorias)) {
      if (variations.map(normalize).includes(header)) {
        mapped[header] = field
      }
    }

    //Caso futuramente hajam campos a mais para serem validados
    // for (const [field, variations] of Object.entries(COLUMN_MAP.opcionais)) {
    //   if(variations.map(normalize).includes(header)) {
    //     mapped[header] = field
    //   }
    // }
  }

  return mapped
}

export async function ParseCSV(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || []
        const mapping = mapHeaders(headers)

        const missing = Object.keys(COLUMN_MAP.obrigatorias).filter(
          (key) => !Object.values(mapping).includes(key)
        )

        if (missing.length > 0) {
          return reject(
            new Error(
              `Colunas obrigatórias ausentes ou com nomes não reconhecidos: ${missing.join(", ")}`
            )
          )
        }

        const data = (results.data as unknown[]).map((row) => {
          const mappedRow: Record<string, unknown> = {}

          if (row && typeof row === "object" && !Array.isArray(row)) {
            for (const [originalHeaders, value] of Object.entries(
              row as Record<string, unknown>
            )) {
              const normalized = normalize(originalHeaders)
              const targetKey = mapping[normalized]
              if (typeof targetKey === "string" && targetKey.length > 0) {
                mappedRow[targetKey] = value
              }
            }
          }

          return mappedRow
        })
        resolve(data)
      },
      error: reject,
    })
  })
}

// export function parseExcel(file: File) {
//   return new Promise((resolve) => {
//     const reader = new FileReader()
//     reader.onload = (e) => {
//       const workbook = XLXS
//     }
//   })
// }
