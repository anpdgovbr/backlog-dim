"use client"

import { NavigateBefore, NavigateNext } from "@mui/icons-material"
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material"
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

export default function ImportarProcessos() {
  const [cabecalho, setCabecalho] = useState<string[]>([])
  const [dados, setDados] = useState<CsvRow[]>([])
  const [loading, setLoading] = useState(false)
  const [progresso, setProgresso] = useState(0)
  const [importado, setImportado] = useState(false)
  const [relatorio, setRelatorio] = useState<Relatorio>({
    sucesso: 0,
    falhas: [],
  })
  // tslint:disable-next-line: no-unused-variable
  const [resumoImportacao] = useState<ResumoImportacao>({
    totalRegistros: 0,
    totalAnonimos: 0,
    responsaveis: {},
    formasEntrada: {},
  })
  const [pagina, setPagina] = useState(0)
  const [linhasPorPagina, setLinhasPorPagina] = useState(10)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      delimiter: ";",
      encoding: "ISO-8859-1",
      complete: (result) => {
        const data = result.data as CsvRow[]
        setCabecalho(data[0])
        setDados(data.slice(1))
        setImportado(false)
        setPagina(0)
      },
    })
  }

  const handleImport = async () => {
    if (!dados.length) return

    setLoading(true)
    setProgresso(0)

    try {
      // 🔹 Convertendo os dados do CSV para o formato correto
      const processos = dados.map((linha) => ({
        responsavelNome: linha[0],
        numeroProcesso: linha[1],
        dataCriacao: linha[2],
        situacaoNome: linha[3],
        formaEntradaNome: linha[4],
        anonimoStr: linha[5],
        requerenteNome: linha[6],
      }))

      const response = await fetch("/api/importar-processos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processos }),
      })

      const resultado = await response.json()

      if (response.ok) {
        setRelatorio({ sucesso: resultado.sucesso, falhas: resultado.falhas })
        setImportado(true)
      } else {
        alert(`Erro na importação: ${resultado.error}`)
      }
    } catch (error) {
      alert("Erro inesperado na importação")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleMudarPagina = (_: unknown, novaPagina: number) => {
    setPagina(novaPagina)
  }

  const handleMudarLinhasPorPagina = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinhasPorPagina(parseInt(event.target.value, 10))
    setPagina(0)
  }

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Importação de Processos
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Button variant="contained" component="label">
            Selecionar CSV
            <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleImport}
            disabled={loading || !dados.length}
          >
            {loading ? `Importando... ${progresso}%` : "Iniciar Importação"}
          </Button>
        </Box>

        {loading && (
          <LinearProgress variant="determinate" value={progresso} sx={{ mb: 1 }} />
        )}

        <Card sx={{ p: 1, mb: 1, bgcolor: "background.paper" }}>
          <Typography variant="h6" gutterBottom>
            {importado ? "Resultado da Importação" : "Análise do Arquivo"}
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={6} md={3}>
              <Estatistica
                titulo="Total"
                valor={importado ? resumoImportacao.totalRegistros : dados.length}
                cor="primary"
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <Estatistica
                titulo="Anônimos"
                valor={
                  importado
                    ? resumoImportacao.totalAnonimos
                    : dados.filter((l) => l[5]?.toLowerCase() === "sim").length
                }
                cor="secondary"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CategoriaResumo
                titulo={importado ? "Responsáveis Importados" : "Responsáveis no Arquivo"}
                dados={
                  importado ? resumoImportacao.responsaveis : contarOcorrencias(dados, 0)
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CategoriaResumo
                titulo={importado ? "Formas de Entrada" : "Formas de Entrada no Arquivo"}
                dados={
                  importado ? resumoImportacao.formasEntrada : contarOcorrencias(dados, 4)
                }
                cor="secondary"
              />
            </Grid>
          </Grid>
        </Card>

        {!!dados.length && (
          <Card sx={{ mb: 1 }}>
            <TableContainer>
              <Typography variant="h6" sx={{ p: 1 }}>
                Pré-visualização dos Dados ({dados.length} registros)
              </Typography>

              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {cabecalho.map((coluna, i) => (
                      <TableCell key={i} sx={{ fontWeight: "bold" }}>
                        {coluna}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dados
                    .slice(
                      pagina * linhasPorPagina,
                      pagina * linhasPorPagina + linhasPorPagina
                    )
                    .map((linha, i) => (
                      <TableRow key={i}>
                        {linha.map((celula, j) => (
                          <TableCell key={j}>{celula || <em>vazio</em>}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                      count={dados.length}
                      rowsPerPage={linhasPorPagina}
                      page={pagina}
                      onPageChange={handleMudarPagina}
                      onRowsPerPageChange={handleMudarLinhasPorPagina}
                      ActionsComponent={({ count, page, rowsPerPage, onPageChange }) => (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            onClick={() => onPageChange(null, page - 1)}
                            disabled={page === 0}
                          >
                            <NavigateBefore />
                          </IconButton>
                          <IconButton
                            onClick={() => onPageChange(null, page + 1)}
                            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                          >
                            <NavigateNext />
                          </IconButton>
                        </Box>
                      )}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Card>
        )}

        {importado && (
          <Box sx={{ mt: 2 }}>
            {relatorio.sucesso > 0 && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {relatorio.sucesso} processos importados com sucesso
              </Alert>
            )}

            {relatorio.falhas.length > 0 && (
              <Alert severity="error">
                <Typography variant="subtitle1" gutterBottom>
                  {relatorio.falhas.length} erros encontrados:
                </Typography>
                <Box component="ul" sx={{ maxHeight: 200, overflow: "auto" }}>
                  {relatorio.falhas.map((falha, i) => (
                    <li key={i}>{falha}</li>
                  ))}
                </Box>
              </Alert>
            )}
          </Box>
        )}
      </Box>
    </Container>
  )
}

// Componentes Auxiliares
const Estatistica = ({
  titulo,
  valor,
  cor,
}: {
  titulo: string
  valor: number
  cor: "primary" | "secondary"
}) => (
  <Card sx={{ textAlign: "center", p: 2, bgcolor: `${cor}.light` }}>
    <Typography variant="subtitle1">{titulo}</Typography>
    <Typography variant="h3" color={`${cor}.main`}>
      {valor}
    </Typography>
  </Card>
)

const CategoriaResumo = ({
  titulo,
  dados,
  cor = "primary",
}: {
  titulo: string
  dados: Record<string, number>
  cor?: "primary" | "secondary"
}) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="subtitle2" gutterBottom>
      {titulo}
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {Object.entries(dados).map(([nome, total]) => (
        <Chip key={nome} label={`${nome} (${total})`} color={cor} variant="outlined" />
      ))}
    </Box>
  </Card>
)
/**
// Funções utilitárias
const formatarData = (data: string): string => {
  const [dia, mes, ano] = data.split("/")
  return ano ? `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}` : ""
}

// 🔹 Obter ou criar entidades com acesso direto ao Prisma

const obterOuCriarResponsavel = async (nome: string): Promise<number> => {
  const existente = await prisma.responsavel.findUnique({ where: { nome } })
  if (existente) return existente.id
  const novo = await prisma.responsavel.create({ data: { nome } })
  return novo.id
}

const obterOuCriarSituacao = async (nome: string): Promise<number> => {
  const existente = await prisma.situacao.findUnique({ where: { nome } })
  if (existente) return existente.id
  const novo = await prisma.situacao.create({ data: { nome } })
  return novo.id
}

const obterOuCriarFormaEntrada = async (nome: string): Promise<number> => {
  const existente = await prisma.formaEntrada.findUnique({ where: { nome } })
  if (existente) return existente.id
  const novo = await prisma.formaEntrada.create({ data: { nome } })
  return novo.id
} */

const contarOcorrencias = (dados: CsvRow[], indice: number): Record<string, number> =>
  dados.reduce(
    (acc, linha) => {
      const valor = linha[indice]?.trim()
      return valor ? { ...acc, [valor]: (acc[valor] || 0) + 1 } : acc
    },
    {} as Record<string, number>
  )
