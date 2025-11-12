import { useNotification } from "@/context/NotificationProvider"
import { StatusInterno } from "@prisma/client"
import Papa from "papaparse"
import { useState } from "react"

type CsvRow = string[]
type Relatorio = { sucesso: number; falhas: string[] }
type ResumoImportacao = {
  totalRegistros: number
  totalAnonimos: number
  responsaveis: Record<string, number>
  formasEntrada: Record<string, number>
}

type MapeamentoCabecalhos = Record<string, string[]>

/**
 * Mapeamento de cabeçalhos possíveis → campo interno
 * Cada campo pode ter múltiplos nomes possíveis (ex: "Responsável", "resp", "responsavel")
 */
const CABECALHOS_POSSIVEIS: MapeamentoCabecalhos = {
  responsavelNome: ["responsável", "responsavel", "responsavel nome", "resp"],
  numeroProcesso: ["número processo", "numero processo", "n° processo"],
  dataCriacao: ["data criação", "data criacao", "criado em"],
  situacaoNome: ["situação", "situacao"],
  formaEntradaNome: ["forma de entrada", "entrada", "canal"],
  anonimoStr: ["anônimo", "anonimo", "é anônimo"],
  requerenteNome: ["requerente", "nome requerente", "solicitante"],
}

/**
 * Hook responsável por toda a lógica de importação de processos CSV
 */
export function useImportarProcessos() {
  const [cabecalho, setCabecalho] = useState<string[]>([])
  const [dados, setDados] = useState<CsvRow[]>([])
  const [loading, setLoading] = useState(false)
  const [progresso, setProgresso] = useState(0)
  const [importado, setImportado] = useState(false)
  const [relatorio, setRelatorio] = useState<Relatorio>({ sucesso: 0, falhas: [] })
  const [resumoImportacao, setResumoImportacao] = useState<ResumoImportacao>({
    totalRegistros: 0,
    totalAnonimos: 0,
    responsaveis: {},
    formasEntrada: {},
  })
  const [fileName, setFileName] = useState<string>("")

  const { notify } = useNotification()

  const resetState = () => {
    setCabecalho([])
    setDados([])
    setImportado(false)
    setProgresso(0)
    setRelatorio({ sucesso: 0, falhas: [] })
    setResumoImportacao({
      totalRegistros: 0,
      totalAnonimos: 0,
      responsaveis: {},
      formasEntrada: {},
    })
  }

  /** 🔍 Faz o parse e identifica as colunas dinamicamente */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetState()
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
      encoding: "ISO-8859-1",
      complete: (result) => {
        const data = result.data as Record<string, string>[]
        if (data.length === 0) {
          notify({ type: "error", message: "Arquivo CSV vazio." })
          return
        }

        const headerKeys = Object.keys(data[0])
        setCabecalho(headerKeys)

        // mapeia automaticamente os nomes de colunas conhecidos
        const dadosPadronizados = data.map((linha) => {
          const novo: Record<string, string> = {}
          for (const [campo, aliases] of Object.entries(CABECALHOS_POSSIVEIS)) {
            const colunaEncontrada = headerKeys.find((col) =>
              aliases.some((alias) => col.toLowerCase().includes(alias.toLowerCase()))
            )
            if (colunaEncontrada) {
              novo[campo] = linha[colunaEncontrada]
            }
          }
          return novo
        })

        setDados(dadosPadronizados as unknown as CsvRow[])
      },
    })

    // limpa o input para permitir re-upload
    event.target.value = ""
  }

  /** 🚀 Realiza a importação linha a linha */
  const handleImport = async () => {
    if (!dados.length) return

    setLoading(true)
    setProgresso(0)
    const totalRows = dados.length
    let successCount = 0
    const failures: string[] = []

    for (let i = 0; i < totalRows; i++) {
      const linha: any = dados[i]
      const processo = {
        ...linha,
        StatusInterno: StatusInterno.IMPORTADO,
      }

      try {
        const response = await fetch("/api/importar-processos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nomeArquivo: fileName,
            processos: [processo],
          }),
        })

        const resultado = await response.json()

        if (response.ok) {
          successCount += resultado.sucesso ?? 1
        } else if (resultado.falhas) {
          failures.push(resultado.falhas.join(", "))
        } else {
          failures.push(resultado.error || "Erro desconhecido")
        }
      } catch (error) {
        failures.push(error instanceof Error ? error.message : "Erro inesperado")
      }

      setProgresso(Math.round(((i + 1) / totalRows) * 100))
    }

    setRelatorio({ sucesso: successCount, falhas: failures })
    setResumoImportacao({
      totalRegistros: totalRows,
      totalAnonimos: dados.filter((d: any) => d.anonimoStr?.toLowerCase() === "sim")
        .length,
      responsaveis: contarOcorrencias(dados.map((d: any) => d.responsavelNome)),
      formasEntrada: contarOcorrencias(dados.map((d: any) => d.formaEntradaNome)),
    })
    setImportado(true)
    setLoading(false)

    if (failures.length === 0) {
      notify({
        type: "success",
        message: `Importação concluída (${successCount} processos)`,
      })
    } else if (successCount === 0) {
      notify({ type: "error", message: `Importação falhou (${failures.length} erros)` })
    } else {
      notify({
        type: "warning",
        message: `Importação parcial: ${successCount} sucesso(s), ${failures.length} erro(s)`,
      })
    }
  }

  return {
    cabecalho,
    dados,
    loading,
    progresso,
    importado,
    relatorio,
    resumoImportacao,
    fileName,
    handleFileUpload,
    handleImport,
  }
}
export const contarOcorrencias = (
  valores: (string | undefined)[]
): Record<string, number> => {
  return valores.reduce(
    (acc, valor) => {
      const v = valor?.trim()
      if (!v) return acc
      acc[v] = (acc[v] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}
