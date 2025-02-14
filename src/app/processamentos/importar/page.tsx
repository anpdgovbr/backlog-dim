'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Papa from 'papaparse'
import { ProcessamentosInput } from '@/types/Processamentos'
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

export default function ImportarProcessamentos() {
  const [csvData, setCsvData] = useState<ProcessamentosInput[]>([])
  const [loading, setLoading] = useState(false)

  // Função para lidar com o upload do arquivo CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: false, // Não usar cabeçalhos
      skipEmptyLines: true,
      delimiter: ';', // Define o delimitador correto para CSVs com ";"
      encoding: 'ISO-8859-1', // Define a codificação correta para arquivos CSV
      complete: (result) => {
        console.log('CSV Data:', result.data) // Depuração

        const data: ProcessamentosInput[] = (result.data as string[][])
          .slice(1)
          .map((row) => ({
            responsavel: row[0]?.trim() || 'Não informado', // Coluna 1: Responsável
            numero_protocolo: row[1] ? Number(row[1].replace(/\D/g, '')) : 0, // Coluna 2: Protocolo (Apenas números)
            data_criacao: row[2] ? formatarData(row[2]) : '', // Coluna 3: Data formatada para YYYY-MM-DD
            status: row[3]?.trim() || 'Pendente', // Coluna 4: Status
            tipo_solicitacao: row[4]?.trim() || 'Denúncia', // Coluna 5: Tipo de Solicitação
            denuncia_anonima:
              row[5]?.toLowerCase() === 'sim' ||
              row[5]?.toLowerCase() === 'true', // Coluna 6: Booleano (Sim/Não)
            ticket_solicitante: row[6]?.trim() || 'Desconhecido' // Coluna 7: Solicitante
          }))

        setCsvData(data)
      }
    })
  }

  // Função para corrigir e formatar datas no formato correto (DD/MM/YYYY → YYYY-MM-DD)
  const formatarData = (dataStr: string): string => {
    const partes = dataStr.split('/')
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}` // Converte para YYYY-MM-DD
    }
    return ''
  }

  // Função para enviar os dados para o Supabase
  const handleImport = async () => {
    if (csvData.length === 0) {
      alert('Nenhum dado para importar!')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('processamentos').insert(csvData)

    setLoading(false)

    if (error) {
      alert('Erro ao importar dados: ' + error.message)
    } else {
      alert('Dados importados com sucesso!')
      setCsvData([]) // Limpa os dados após a importação
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Importar Processamentos via CSV
        </Typography>

        {/* Input para Upload do CSV */}
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {/* Tabela para Visualizar os Dados Antes de Importar */}
        {/* Tabela para Visualizar os Dados Antes de Importar */}
        {csvData.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Responsável</TableCell>
                  <TableCell>Protocolo</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Anônimo?</TableCell>
                  <TableCell>Solicitante</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.responsavel}</TableCell>
                    <TableCell>{row.numero_protocolo}</TableCell>
                    <TableCell>{row.data_criacao}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.tipo_solicitacao}</TableCell>
                    <TableCell>
                      {row.denuncia_anonima ? 'Sim' : 'Não'}
                    </TableCell>
                    <TableCell>{row.ticket_solicitante}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Botão para Importar os Dados */}
        {csvData.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleImport}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Importar Dados'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  )
}
