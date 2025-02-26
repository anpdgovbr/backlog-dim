'use client'

import { useState } from 'react'
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
  CircularProgress
} from '@mui/material'

export default function ImportarProcessos() {
  const [csvData, setCsvData] = useState<string[][]>([]) // Apenas os dados crus do CSV
  const [loading, setLoading] = useState(false)
  const [relatorio, setRelatorio] = useState<{
    sucesso: number
    falhas: string[]
  }>({
    sucesso: 0,
    falhas: []
  })

  // 🟢 Primeira Etapa: Apenas Leitura e Exibição
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('📂 Arquivo recebido:', file.name)

    Papa.parse(file, {
      header: false, // Não usamos cabeçalhos
      skipEmptyLines: true,
      delimiter: ';',
      encoding: 'ISO-8859-1',
      dynamicTyping: false, // Evita conversão automática de números
      complete: (result) => {
        console.log('🟢 CSV processado com sucesso!', result.data)

        // 🔴 Descartamos a primeira linha (cabeçalho)
        const dataSemCabecalho = (result.data as string[][]).slice(1)

        // 🔵 Convertendo corretamente os números para string
        const dataCorrigida = dataSemCabecalho.map((row) => {
          row[1] = corrigirNumero(row[1]) // Corrige a notação científica do número do protocolo
          return row
        })

        setCsvData(dataCorrigida)
      }
    })
  }

  // 🔴 Segunda Etapa: Importação e Busca de IDs
  const handleImport = async () => {
    if (csvData.length === 0) {
      alert('Nenhum dado para importar!')
      return
    }

    console.log('🚀 Iniciando importação dos dados...')
    setLoading(true)

    let sucesso = 0
    let falhas: string[] = []

    for (const [index, row] of csvData.entries()) {
      console.log(`📥 Processando linha ${index + 1}:`, row)

      try {
        // 📌 Garantindo que o número do protocolo seja tratado como string correta
        const numeroProcesso = corrigirNumero(row[1])

        // 📌 Definindo se a denúncia é anônima (se não informado, assume `false`)
        const anonimo = row[5] ? row[5].toLowerCase() === 'sim' : false

        // 📌 Se for anônimo, o campo `requerente` recebe o número do protocolo
        const requerente = anonimo
          ? numeroProcesso
          : row[6]?.trim() || undefined

        // 🔵 Montagem do objeto a ser inserido
        const processo: ProcessoInput = {
          responsavelId: await buscarOuCriarId('Responsavel', row[0]), // Responsável pelo atendimento
          numero: numeroProcesso, // Nº do protocolo como string exata
          dataCriacao: row[2] ? formatarData(row[2]) : '', // Data da criação
          situacaoId: await buscarOuCriarId('Situacao', row[3]), // Status
          formaEntradaId: await buscarOuCriarId('FormaEntrada', row[4]), // Tipo de solicitação
          anonimo, // Assumimos `false` se não vier no CSV
          requerente // Se for anônimo, recebe `numero`
        }

        console.log(`📌 Inserindo processo no banco:`, processo)

        const { error } = await supabase.from('Processo').insert(processo)

        if (error) {
          throw new Error(error.message)
        }

        console.log(`✅ Linha ${index + 1} inserida com sucesso!`)
        sucesso++
      } catch (error: any) {
        console.error(`❌ Falha na linha ${index + 1}:`, error.message)
        falhas.push(`Erro na linha ${index + 1}: ${error.message}`)
      }
    }

    setRelatorio({ sucesso, falhas })
    setLoading(false)

    console.log('✅ Importação finalizada!')
    if (falhas.length === 0) {
      alert(`Importação concluída! ${sucesso} registros inseridos com sucesso.`)
      setCsvData([])
    } else {
      alert(
        `Importação finalizada! ${sucesso} registros inseridos, ${falhas.length} falhas.`
      )
    }
  }

  const formatarData = (dataStr: string): string => {
    console.log('📅 Formatando data:', dataStr)
    const partes = dataStr.split('/')
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`
    }
    return ''
  }

  // 📌 Função para corrigir números que podem estar em notação científica
  const corrigirNumero = (valor: any): string => {
    if (!valor) return 'Não informado'

    // Se for número, convertemos para string sem notação científica
    if (typeof valor === 'number') {
      return valor.toFixed(0) // Remove casas decimais e notação científica
    }

    // Se for string, removemos espaços extras
    return String(valor).trim()
  }

  const buscarOuCriarId = async (
    tabela: string,
    nome: string
  ): Promise<number> => {
    if (!nome) return 0
    console.log(`🔎 Buscando ID de "${nome}" na tabela ${tabela}`)

    const { data, error } = await supabase
      .from(tabela)
      .select('id')
      .eq('nome', nome)
      .single()
    if (data) return data.id

    console.log(`❌ "${nome}" não encontrado, criando novo registro...`)

    const { data: novo, error: insertError } = await supabase
      .from(tabela)
      .insert({ nome })
      .select('id')
      .single()
    if (novo) return novo.id

    console.error(
      `⚠️ Erro ao buscar/criar "${nome}" na tabela ${tabela}:`,
      error || insertError
    )
    return 0
  }

  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Importar Processos via CSV
        </Typography>

        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {csvData.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
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
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Importar Dados'}
        </Button>
      </Box>
    </Container>
  )
}
