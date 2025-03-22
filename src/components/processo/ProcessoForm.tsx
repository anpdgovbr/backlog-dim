"use client"

import { EnumData } from "@/types/EnumData"
import { ProcessoOutput } from "@/types/Processo"
import { RequeridoOutput } from "@/types/Requerido"
import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

export default function ProcessoForm({
  processo,
  setProcesso,
}: {
  processo: ProcessoOutput | null
  setProcesso: (data: ProcessoOutput) => void
}) {
  const [loadingListas, setLoadingListas] = useState(true)

  const [listas, setListas] = useState<{
    formaEntrada: EnumData[]
    responsavel: EnumData[]
    requerido: RequeridoOutput[]
    situacao: EnumData[]
    encaminhamento: EnumData[]
    pedidoManifestacao: EnumData[]
    contatoPrevio: EnumData[]
    evidencia: EnumData[]
    tipoReclamacao: EnumData[]
  }>({
    formaEntrada: [],
    responsavel: [],
    requerido: [],
    situacao: [],
    encaminhamento: [],
    pedidoManifestacao: [],
    contatoPrevio: [],
    evidencia: [],
    tipoReclamacao: [],
  })

  // 🔹 Carrega as listas auxiliares
  useEffect(() => {
    async function fetchLista(endpoint: string) {
      try {
        const response = await fetch(`/api/${endpoint}`)
        if (!response.ok) throw new Error(`Erro ao buscar ${endpoint}`)
        const data = await response.json()
        return data
      } catch (error) {
        console.error(`❌ Erro ao carregar ${endpoint}:`, error)
        return []
      }
    }

    async function fetchListas() {
      try {
        const [
          formaEntrada,
          responsavel,
          requerido,
          situacao,
          encaminhamento,
          pedidoManifestacao,
          contatoPrevio,
          evidencia,
          tipoReclamacao,
        ] = await Promise.all([
          fetchLista("formaEntrada"),
          fetchLista("responsaveis"),
          fetchLista("requeridos"),
          fetchLista("situacoes"),
          fetchLista("encaminhamentos"),
          fetchLista("pedidosManifestacao"),
          fetchLista("contatosPrevios"),
          fetchLista("evidencias"),
          fetchLista("tiposReclamacao"),
        ])

        setListas({
          formaEntrada: Array.isArray(formaEntrada) ? formaEntrada : [],
          responsavel: Array.isArray(responsavel) ? responsavel : [],
          requerido: Array.isArray(requerido) ? requerido : [],
          situacao: Array.isArray(situacao) ? situacao : [],
          encaminhamento: Array.isArray(encaminhamento) ? encaminhamento : [],
          pedidoManifestacao: Array.isArray(pedidoManifestacao) ? pedidoManifestacao : [],
          contatoPrevio: Array.isArray(contatoPrevio) ? contatoPrevio : [],
          evidencia: Array.isArray(evidencia) ? evidencia : [],
          tipoReclamacao: Array.isArray(tipoReclamacao) ? tipoReclamacao : [],
        })
      } catch (error) {
        console.error("❌ Erro ao carregar listas:", error)
      } finally {
        setLoadingListas(false)
      }
    }
    fetchListas()
  }, [])

  // 🔹 Atualiza estado do processo ao modificar inputs
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setProcesso({ ...processo!, [event.target.name]: event.target.value })
  }

  if (!processo) return <Typography>Carregando Processo...</Typography>
  if (loadingListas) return <Typography>Carregando listas...</Typography>

  return (
    <Box sx={{ maxWidth: 600 }}>
      {/* Chip de Anonimato */}
      <Box sx={{ display: "flex", justifyContent: "start", mb: 2 }}>
        <Chip
          label={processo.anonimo ? "Denúncia Anônima" : "Identificado"}
          color={processo.anonimo ? "error" : "primary"}
        />
      </Box>

      {/* Número do Processo */}
      <TextField
        size="small"
        fullWidth
        label="Número do Processo"
        value={processo.numero}
        disabled
        sx={{ mb: 2 }}
      />

      {/* Data de Criação */}
      <TextField
        fullWidth
        size="small"
        label="Data de Criação"
        value={new Date(processo.dataCriacao).toLocaleDateString()}
        disabled
        sx={{ mb: 2 }}
      />

      {/* Nome do Requerente */}
      <TextField
        size="small"
        fullWidth
        label="Requerente"
        name="requerente"
        value={processo.requerente || ""}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      {/* Campos Selecionáveis */}
      <Grid container spacing={2}>
        {[
          { key: "formaEntrada", label: "Forma de Entrada" },
          { key: "responsavel", label: "Responsável" },
          { key: "requerido", label: "Requerido" },
          { key: "situacao", label: "Situação" },
          { key: "encaminhamento", label: "Encaminhamento" },
          { key: "pedidoManifestacao", label: "Pedido de Manifestação" },
          { key: "contatoPrevio", label: "Contato Prévio" },
          { key: "evidencia", label: "Evidência" },
          { key: "tipoReclamacao", label: "Tipo de Reclamação" },
        ].map(({ key, label }) => {
          const lista = listas[key as keyof typeof listas] ?? []
          const selectedValue =
            lista.find(
              (item) =>
                (item as EnumData)?.id ===
                (processo[key as keyof ProcessoOutput] as EnumData)?.id
            )?.id || ""

          return (
            <Grid item xs={12} sm={6} key={key}>
              <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                  name={key}
                  label={label}
                  value={selectedValue}
                  onChange={(e) => {
                    const selectedItem = lista.find(
                      (item) => item.id === Number(e.target.value)
                    )
                    if (selectedItem) {
                      setProcesso({ ...processo, [key]: selectedItem })
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxWidth: 400 }, // limite no dropdown
                    },
                  }}
                >
                  {lista.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      <Tooltip title={item.nome}>
                        <Box
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                        >
                          {item.nome}
                        </Box>
                      </Tooltip>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
