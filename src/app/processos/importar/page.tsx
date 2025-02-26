'use client'

import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Papa from 'papaparse'
import { ProcessoInput } from '@/types/Processo'
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Alert,
  Grid,
  Chip
} from '@mui/material'

export default function ImportarProcessos() {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [loading, setLoading] = useState(false)
  const [relatorio, setRelatorio] = useState<{
    sucesso: number
    falhas: string[]
  }>({
    sucesso: 0,
    falhas: []
  })
  const [importado, setImportado] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      delimiter: ';',
      encoding: 'ISO-8859-1',
      complete: (result) => {
        const dataSemCabecalho = (result.data as string[][]).slice(1)
        const dataCorrigida = dataSemCabecalho.map((row) => {
          row[1] = corrigirNumero(row[1])
          return row
        })
        setCsvData(dataCorrigida)
      }
    })
  }

  const handleImport = async () => {
    if (csvData.length === 0) return

    setLoading(true)
    let sucesso = 0
    let falhas: string[] = []

    for (const row of csvData) {
      try {
        const numeroProcesso = corrigirNumero(row[1])
        const anonimo = row[5] ? row[5].toLowerCase() === 'sim' : false
        const requerente = anonimo
          ? numeroProcesso
          : row[6]?.trim() || undefined

        const processo: ProcessoInput = {
          responsavelId: await buscarOuCriarId('Responsavel', row[0]),
          numero: numeroProcesso,
          dataCriacao: row[2] ? formatarData(row[2]) : '',
          situacaoId: await buscarOuCriarId('Situacao', row[3]),
          formaEntradaId: await buscarOuCriarId('FormaEntrada', row[4]),
          anonimo,
          requerente
        }

        const { error } = await supabase.from('Processo').insert(processo)

        if (error) {
          throw new Error(error.message)
        }
        sucesso++
      } catch (error: any) {
        falhas.push(error.message)
      }
    }

    setRelatorio({ sucesso, falhas })
    setLoading(false)
    setImportado(true)
  }

  const resumo = useMemo(() => {
    const totalRegistros = csvData.length
    const totalAnonimos = csvData.filter(
      (row) => row[5]?.toLowerCase() === 'sim'
    ).length

    const responsaveis = csvData.reduce<Record<string, number>>((acc, row) => {
      acc[row[0]] = (acc[row[0]] || 0) + 1
      return acc
    }, {})

    const formasEntrada = csvData.reduce<Record<string, number>>((acc, row) => {
      acc[row[4]] = (acc[row[4]] || 0) + 1
      return acc
    }, {})

    return { totalRegistros, totalAnonimos, responsaveis, formasEntrada }
  }, [csvData])

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Importar Processos via CSV
        </Typography>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleImport}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Importar Dados'}
          </Button>
        </Box>

        {csvData.length > 0 && (
          <Card sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumo dos Dados Lidos
            </Typography>
            <Grid container spacing={2}>
              {/* Total de Registros e Anônimos lado a lado */}
              <Grid item xs={6}>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                  <Typography variant="h6">Total de Registros</Typography>
                  <Typography variant="h4" color="primary">
                    {resumo.totalRegistros}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#ffecb3' }}>
                  <Typography variant="h6">Registros Anônimos</Typography>
                  <Typography variant="h4" color="secondary">
                    {resumo.totalAnonimos}
                  </Typography>
                </Card>
              </Grid>

              {/* Responsáveis com contador estilizado */}
              <Grid item xs={12}>
                <Typography variant="h6">Responsáveis Encontrados</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(resumo.responsaveis).map(([nome, count]) => (
                    <Chip
                      key={nome}
                      label={`${nome} (${count})`}
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Formas de Entrada com contador estilizado */}
              <Grid item xs={12}>
                <Typography variant="h6">Formas de Entrada</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(resumo.formasEntrada).map(([nome, count]) => (
                    <Chip
                      key={nome}
                      label={`${nome} (${count})`}
                      color="secondary"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Card>
        )}

        {importado ? (
          <Box sx={{ mt: 3 }}>
            {relatorio.sucesso > 0 && (
              <Alert severity="success">
                Importação concluída! {relatorio.sucesso} registros inseridos
                com sucesso.
              </Alert>
            )}
            {relatorio.falhas.length > 0 && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {relatorio.falhas.length} falhas ocorreram:
                <ul>
                  {relatorio.falhas.map((falha, index) => (
                    <li key={index}>{falha}</li>
                  ))}
                </ul>
              </Alert>
            )}
          </Box>
        ) : (
          csvData.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Responsável</TableCell>
                    <TableCell>Nº do Protocolo</TableCell>
                    <TableCell>Data Criação</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tipo de Solicitação</TableCell>
                    <TableCell>Denúncia Anônima?</TableCell>
                    <TableCell>Solicitante</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {csvData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row[0]}</TableCell>
                      <TableCell>{corrigirNumero(row[1])}</TableCell>
                      <TableCell>{row[2]}</TableCell>
                      <TableCell>{row[3]}</TableCell>
                      <TableCell>{row[4]}</TableCell>
                      <TableCell>{row[5] ? row[5] : 'Não'}</TableCell>
                      <TableCell>{row[6]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
      </Box>
    </Container>
  )
}

const formatarData = (dataStr: string): string => {
  const partes = dataStr.split('/')
  return partes.length === 3 ? `${partes[2]}-${partes[1]}-${partes[0]}` : ''
}

const corrigirNumero = (valor: any): string => {
  if (!valor) return 'Não informado'
  return typeof valor === 'number' ? valor.toFixed(0) : String(valor).trim()
}

const buscarOuCriarId = async (
  tabela: string,
  nome: string
): Promise<number> => {
  const { data } = await supabase
    .from(tabela)
    .select('id')
    .eq('nome', nome)
    .single()
  return data ? data.id : 0
}
