"use client"

import { useState } from "react"

import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DescriptionIcon from "@mui/icons-material/Description"
import NavigateBefore from "@mui/icons-material/NavigateBefore"
import NavigateNext from "@mui/icons-material/NavigateNext"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import { GovBRButton } from "@anpdgovbr/shared-ui"
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

import { DashboardLayout } from "@/components/layouts"
import MetricCard from "@/components/ui/MetricCard"
import { withPermissao } from "@anpdgovbr/rbac-react"
import {
  contarOcorrencias,
  useImportarProcessos,
} from "@/app/dashboard/importar/useImportarProcessos"

function ImportarProcessosContent() {
  const {
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
  } = useImportarProcessos()

  const [pagina, setPagina] = useState(0)
  const [linhasPorPagina, setLinhasPorPagina] = useState(10)

  const handleMudarPagina = (_: unknown, novaPagina: number) => setPagina(novaPagina)

  const handleMudarLinhasPorPagina = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinhasPorPagina(parseInt(event.target.value, 10))
    setPagina(0)
  }

  return (
    <DashboardLayout
      title="Importação de Processos"
      subtitle="Importe processos em lote a partir de arquivos CSV"
      actions={
        <Stack direction="row" spacing={2}>
          <GovBRButton
            variant="outlined"
            component="label"
            disabled={loading}
            startIcon={<CloudUploadIcon />}
          >
            Selecionar CSV
            <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
          </GovBRButton>

          <GovBRButton
            variant="contained"
            onClick={handleImport}
            disabled={loading || !dados.length || importado}
            startIcon={!loading && <PlayArrowIcon />}
          >
            {loading ? `Importando... ${progresso}%` : "Iniciar Importação"}
          </GovBRButton>
        </Stack>
      }
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

      {dados.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CategoriaResumo
              titulo={importado ? "Responsáveis Importados" : "Responsáveis no Arquivo"}
              dados={
                importado
                  ? resumoImportacao.responsaveis
                  : contarOcorrencias(dados.map((d: any) => d.responsavelNome))
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CategoriaResumo
              titulo={importado ? "Formas de Entrada" : "Formas de Entrada no Arquivo"}
              dados={
                importado
                  ? resumoImportacao.formasEntrada
                  : contarOcorrencias(dados.map((d: any) => d.formaEntradaNome))
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

const ImportarProcessos = withPermissao(
  ImportarProcessosContent,
  "Cadastrar",
  "Processo",
  {
    redirect: false,
  }
)

export default ImportarProcessos
