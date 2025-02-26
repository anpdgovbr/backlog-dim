'use client'

import { supabase } from '@/lib/supabase'
import { ProcessoInput } from '@/types/Processo'
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Typography
} from '@mui/material'
import Papa from 'papaparse'
import { useState } from 'react'

export default function ImportarProcessos() {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importado, setImportado] = useState(false)
  const [relatorio, setRelatorio] = useState<{
    sucesso: number
    falhas: string[]
  }>({
    sucesso: 0,
    falhas: []
  })
  const [resumoImportado, setResumoImportado] = useState<{
    totalRegistros: number
    totalAnonimos: number
    responsaveis: Record<string, number>
    formasEntrada: Record<string, number>
  }>({
    totalRegistros: 0,
    totalAnonimos: 0,
    responsaveis: {},
    formasEntrada: {}
  })

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
        setCsvData(dataSemCabecalho)
      }
    })
  }

  const handleImport = async () => {
    if (csvData.length === 0) return

    setLoading(true)
    setProgress(0)
    let sucesso = 0
    let falhas: string[] = []

    let responsaveisImportados: Record<string, number> = {}
    let formasEntradaImportadas: Record<string, number> = {}
    let totalAnonimosImportados = 0

    for (const [index, row] of csvData.entries()) {
      try {
        const numeroProcesso = row[1]
        const anonimo = row[5] ? row[5].toLowerCase() === 'sim' : false
        const requerente = anonimo
          ? numeroProcesso
          : row[6]?.trim() || undefined

        const responsavelId = await buscarOuCriarId('Responsavel', row[0])
        const formaEntradaId = await buscarOuCriarId('FormaEntrada', row[4])

        const processo: ProcessoInput = {
          responsavelId,
          numero: numeroProcesso,
          dataCriacao: row[2] ? formatarData(row[2]) : '',
          situacaoId: await buscarOuCriarId('Situacao', row[3]),
          formaEntradaId,
          anonimo,
          requerente
        }

        const { error } = await supabase.from('Processo').insert(processo)

        if (error) {
          throw new Error(traduzirErro(error.message, numeroProcesso))
        }

        sucesso++
        if (anonimo) {
          totalAnonimosImportados++
        }
        responsaveisImportados[row[0]] =
          (responsaveisImportados[row[0]] || 0) + 1
        formasEntradaImportadas[row[4]] =
          (formasEntradaImportadas[row[4]] || 0) + 1
      } catch (error: any) {
        falhas.push(error.message)
      }

      setProgress(Math.round(((index + 1) / csvData.length) * 100))
    }

    setRelatorio({ sucesso, falhas })
    setResumoImportado({
      totalRegistros: sucesso,
      totalAnonimos: totalAnonimosImportados, // ✅ Agora mostra apenas os importados
      responsaveis: responsaveisImportados,
      formasEntrada: formasEntradaImportadas
    })
    setLoading(false)
    setImportado(true)
  }

  const traduzirErro = (mensagem: string, numero: string) => {
    if (mensagem.includes('duplicate key value violates unique constraint')) {
      return `O processo ${numero} já está cadastrado.`
    }
    return `Erro ao inserir processo ${numero}: ${mensagem}`
  }

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
            {loading ? `${progress}%` : 'Importar Dados'}
          </Button>
        </Box>

        {loading && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 2 }}
          />
        )}

        {/* 🟢 RESUMO DINÂMICO */}
        <Card sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            {importado
              ? 'Resumo dos Dados Importados'
              : 'Resumo dos Dados Lidos'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                <Typography variant="h6">Total de Registros</Typography>
                <Typography variant="h4" color="primary">
                  {importado ? resumoImportado.totalRegistros : csvData.length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#ffecb3' }}>
                <Typography variant="h6">Registros Anônimos</Typography>
                <Typography variant="h4" color="secondary">
                  {importado
                    ? resumoImportado.totalAnonimos // ✅ Agora mostra apenas os importados
                    : csvData.filter((row) => row[5]?.toLowerCase() === 'sim')
                        .length}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Responsáveis Encontrados</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(
                  importado
                    ? resumoImportado.responsaveis
                    : contarItens(csvData, 0)
                ).map(([nome, count]) => (
                  <Chip
                    key={nome}
                    label={`${nome} (${count})`}
                    color="primary"
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Formas de Entrada</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(
                  importado
                    ? resumoImportado.formasEntrada
                    : contarItens(csvData, 4)
                ).map(([nome, count]) => (
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

        {importado && (
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

const contarItens = (
  dados: string[][],
  coluna: number
): Record<string, number> => {
  return dados.reduce<Record<string, number>>((acc, row) => {
    if (row[coluna]) {
      acc[row[coluna]] = (acc[row[coluna]] || 0) + 1
    }
    return acc
  }, {})
}
