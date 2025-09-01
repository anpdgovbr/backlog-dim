"use client"

import Papa from "papaparse"

import { useState } from "react"

import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DescriptionIcon from "@mui/icons-material/Description"
import NavigateBefore from "@mui/icons-material/NavigateBefore"
import NavigateNext from "@mui/icons-material/NavigateNext"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableFooter from "@mui/material/TableFooter"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"

import { StatusInterno } from "@anpdgovbr/shared-types"

import { DashboardLayout } from "@/components/layouts"
import MetricCard from "@/components/ui/MetricCard"
import { useNotification } from "@/context/NotificationProvider"
import { withPermissao } from "@anpdgovbr/rbac-react"

const EXPECTED_COLUMNS = 7

type CsvRow = string[]
type Relatorio = { sucesso: number; falhas: string[] }
type ResumoImportacao = {
  totalRegistros: number
  totalAnonimos: number
  responsaveis: Record<string, number>
  formasEntrada: Record<string, number>
}

function ImportarProcessosContent() {
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
  const [pagina, setPagina] = useState(0)
  const [linhasPorPagina, setLinhasPorPagina] = useState(10)
  const { notify } = useNotification()
  const [fileName, setFileName] = useState<string>("")

  // Reseta todos os estados ao carregar um novo arquivo
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
    setPagina(0)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetState()
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      delimiter: ";",
      encoding: "ISO-8859-1",
      complete: (result) => {
        const data = result.data as CsvRow[]
        if (data.length === 0) {
          notify({ type: "error", message: "Arquivo vazio." })
          return
        }
        // Validação do número de colunas
        if (data[0].length !== EXPECTED_COLUMNS) {
          notify({
            type: "error",
            message: `Número de colunas inesperado. Esperado: ${EXPECTED_COLUMNS}, encontrado: ${data[0].length}.`,
          })
          return
        }
        setCabecalho(data[0])
        setDados(data.slice(1))
      },
    })
    // Limpa o valor do input para permitir re-upload do mesmo arquivo
    event.target.value = ""
  }

  const handleImport = async () => {
    if (!dados.length) return

    setLoading(true)
    setProgresso(0)

    const totalRows = dados.length
    let successCount = 0
    const failures: string[] = []

    // Processa cada linha individualmente
    for (let i = 0; i < totalRows; i++) {
      const linha = dados[i]
      const processo = {
        responsavelNome: linha[0],
        numeroProcesso: linha[1],
        dataCriacao: linha[2],
        situacaoNome: linha[3],
        formaEntradaNome: linha[4],
        anonimoStr: linha[5],
        requerenteNome: linha[6],
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
        } else {
          // Extraí somente a mensagem de erro, utilizando o campo 'falhas' se disponível.
          if (resultado.falhas && Array.isArray(resultado.falhas)) {
            failures.push(resultado.falhas.join(", "))
          } else if (resultado.error) {
            failures.push(resultado.error)
          } else {
            failures.push("Erro desconhecido")
          }
        }
      } catch (error) {
        let errorMessage = "Erro inesperado na importação"
        if (error instanceof Error) {
          errorMessage = error.message
        }
        console.error("Erro ao importar processo:", error)
        failures.push(errorMessage)
      }

      // Atualiza o progresso conforme o processamento das linhas
      setProgresso(Math.round(((i + 1) / totalRows) * 100))
    }

    setRelatorio({ sucesso: successCount, falhas: failures })
    setResumoImportacao({
      totalRegistros: totalRows,
      totalAnonimos: dados.filter((l) => l[5]?.toLowerCase() === "sim").length,
      responsaveis: contarOcorrencias(dados, 0),
      formasEntrada: contarOcorrencias(dados, 4),
    })
    setImportado(true)
    setLoading(false)

    // Dispara a notificação com base no resultado:
    if (failures.length === 0) {
      notify({
        type: "success",
        message: `Importação concluída com sucesso (${successCount} processos importados)`,
      })
    } else if (successCount === 0) {
      notify({
        type: "error",
        message: `Importação concluída com erros (0 importados, ${failures.length} erros)`,
      })
    } else {
      notify({
        type: "warning",
        message: `Importação parcialmente concluída: ${successCount} processos importados e ${failures.length} erros`,
      })
    }
  }

  const handleMudarPagina = (_: unknown, novaPagina: number) => setPagina(novaPagina)

  const handleMudarLinhasPorPagina = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinhasPorPagina(parseInt(event.target.value, 10))
    setPagina(0)
  }

  const actions = (
    <Stack direction="row" spacing={2}>
      <Button
        variant="outlined"
        component="label"
        disabled={loading}
        startIcon={<CloudUploadIcon />}
      >
        Selecionar CSV
        <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
      </Button>

      <Button
        variant="contained"
        onClick={handleImport}
        disabled={loading || !dados.length || importado}
        startIcon={loading ? undefined : <PlayArrowIcon />}
      >
        {loading ? `Importando... ${progresso}%` : "Iniciar Importação"}
      </Button>
    </Stack>
  )

  return (
    <DashboardLayout
      title="Importação de Processos"
      subtitle="Importe processos em lote a partir de arquivos CSV"
      actions={actions}
    >
      {/* Barra de progresso */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={progresso}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
              },
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: "center" }}
          >
            Processando registro {Math.round((progresso / 100) * dados.length)} de{" "}
            {dados.length}
          </Typography>
        </Box>
      )}

      {/* Arquivo selecionado */}
      {fileName && (
        <Alert icon={<DescriptionIcon />} severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Arquivo:</strong> {fileName} ({dados.length} registros)
          </Typography>
        </Alert>
      )}

      {/* Métricas do arquivo/importação */}
      {dados.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            {importado ? "Resultado da Importação" : "Análise do Arquivo"}
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Total de Registros"
                value={importado ? resumoImportacao.totalRegistros : dados.length}
                color="primary"
                icon={<DescriptionIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Registros Anônimos"
                value={
                  importado
                    ? resumoImportacao.totalAnonimos
                    : dados.filter((l) => l[5]?.toLowerCase() === "sim").length
                }
                color="secondary"
                icon={<DescriptionIcon />}
              />
            </Grid>

            {importado && (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <MetricCard
                    title="Importados com Sucesso"
                    value={relatorio.sucesso}
                    color="success"
                    icon={<DescriptionIcon />}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <MetricCard
                    title="Erros Encontrados"
                    value={relatorio.falhas.length}
                    color="error"
                    icon={<DescriptionIcon />}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      )}

      {/* Resumos por categoria */}
      {dados.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CategoriaResumo
              titulo={importado ? "Responsáveis Importados" : "Responsáveis no Arquivo"}
              dados={
                importado ? resumoImportacao.responsaveis : contarOcorrencias(dados, 0)
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CategoriaResumo
              titulo={importado ? "Formas de Entrada" : "Formas de Entrada no Arquivo"}
              dados={
                importado ? resumoImportacao.formasEntrada : contarOcorrencias(dados, 4)
              }
              cor="secondary"
            />
          </Grid>
        </Grid>
      )}

      {/* Tabela de pré-visualização */}
      {!importado && !!dados.length && (
        <Card
          sx={{
            mb: 3,
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 2,
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
            <Typography variant="h6">
              Pré-visualização dos Dados ({dados.length} registros)
            </Typography>
          </Box>

          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {cabecalho.map((coluna, i) => (
                    <TableCell key={i} sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
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
                        <TableCell key={j}>
                          {celula || <em style={{ color: "#999" }}>vazio</em>}
                        </TableCell>
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

      {/* Relatório de importação */}
      {importado && (
        <Box>
          {relatorio.sucesso > 0 && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                ✅ {relatorio.sucesso} processos importados com sucesso
              </Typography>
            </Alert>
          )}

          {relatorio.falhas.length > 0 && (
            <Alert severity="error">
              <Typography variant="subtitle1" gutterBottom>
                ❌ {relatorio.falhas.length} erro(s) encontrados:
              </Typography>
              <Box
                component="ol"
                sx={{
                  maxHeight: 300,
                  overflowY: "auto",
                  pl: 2,
                  "& li": { mb: 0.5 },
                }}
              >
                {relatorio.falhas.map((falha, i) => (
                  <li key={i}>
                    <Typography variant="body2">{falha}</Typography>
                  </li>
                ))}
              </Box>
            </Alert>
          )}
        </Box>
      )}
    </DashboardLayout>
  )
}

// Componente de resumo por categoria
const CategoriaResumo = ({
  titulo,
  dados,
  cor = "primary",
}: {
  titulo: string
  dados: Record<string, number>
  cor?: "primary" | "secondary"
}) => (
  <Card
    sx={{
      p: 3,
      height: "100%",
      border: "1px solid rgba(0, 0, 0, 0.08)",
      borderRadius: 2,
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
      {titulo}
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {Object.entries(dados).length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nenhum dado disponível
        </Typography>
      ) : (
        Object.entries(dados).map(([nome, total]) => (
          <Chip
            key={nome}
            label={`${nome} (${total})`}
            color={cor}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        ))
      )}
    </Box>
  </Card>
)

// Função auxiliar
const contarOcorrencias = (dados: CsvRow[], indice: number): Record<string, number> =>
  dados.reduce(
    (acc, linha) => {
      const valor = linha[indice]?.trim()
      return valor ? { ...acc, [valor]: (acc[valor] || 0) + 1 } : acc
    },
    {} as Record<string, number>
  )

const ImportarProcessos = withPermissao(
  ImportarProcessosContent,
  "Cadastrar",
  "Processo",
  {
    redirect: false,
  }
)

export default ImportarProcessos
