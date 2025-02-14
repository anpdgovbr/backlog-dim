'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'

import { ProcessamentosInput } from '@/types/Requerimentos'
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'

export default function ProcessamentoForm() {
  const [formData, setFormData] = useState<ProcessamentosInput>({
    responsavel: '',
    numero_protocolo: 0,
    data_criacao: '',
    status: 'Pendente',
    tipo_solicitacao: 'Denúncia',
    denuncia_anonima: false,
    ticket_solicitante: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true) // Ativa o loading

    try {
      const { error } = await supabase.from('processamentos').insert([formData])

      if (error) {
        alert('Erro ao salvar: ' + error.message)
      } else {
        alert('Processamento salvo com sucesso!')
        setFormData((prev) => ({
          ...prev,
          responsavel: '',
          data_criacao: '',
          denuncia_anonima: false,
          ticket_solicitante: ''
        }))
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro inesperado ao salvar.')
    } finally {
      setIsLoading(false) // Desativa o loading
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        className="br-card"
        sx={{ p: 4, mt: 4, boxShadow: 3, borderRadius: 2 }}
      >
        <Typography variant="h5" component="h2" className="br-card-title">
          Novo Processamento
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            label="Responsável pelo Atendimento"
            name="responsavel"
            value={formData.responsavel}
            onChange={handleInputChange}
            required
          />

          <TextField
            sx={{ mt: 2 }}
            fullWidth
            type="number"
            label="Número do Protocolo"
            name="numero_protocolo"
            value={formData.numero_protocolo}
            onChange={handleInputChange}
            required
          />
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            type="date"
            label="Data de Criação"
            name="data_criacao"
            value={formData.data_criacao}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            placeholder="DD/MM/AAAA"
            required
          />

          <FormControl sx={{ mt: 2 }} fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
            >
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Em Andamento">Em Andamento</MenuItem>
              <MenuItem value="Concluído">Concluído</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ mt: 2 }} fullWidth>
            <InputLabel>Tipo de Solicitação</InputLabel>
            <Select
              name="tipo_solicitacao"
              value={formData.tipo_solicitacao}
              onChange={handleSelectChange}
            >
              <MenuItem value="Denúncia">Denúncia</MenuItem>
              <MenuItem value="Petição">Petição</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                name="denuncia_anonima"
                checked={formData.denuncia_anonima}
                onChange={handleSelectChange}
              />
            }
            label="Denúncia Anônima?"
          />

          <TextField
            sx={{ mt: 2 }}
            fullWidth
            label="Ticket > Solicitante"
            name="ticket_solicitante"
            value={formData.ticket_solicitante}
            onChange={handleInputChange}
            required
          />

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Processamento'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  )
}
