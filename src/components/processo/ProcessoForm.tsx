"use client"

import { EnumData } from "@/types/EnumData"
import { ProcessoInput, ProcessoOutput } from "@/types/Processo"
import { RequeridoOutput } from "@/types/Requerido"
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

export default function ProcessoForm({ processoId }: { processoId: number }) {
  const [processo, setProcesso] = useState<ProcessoOutput | null>(null)
  //const [requerido, setRequerido] = useState<RequeridoOutput | null>(null)
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
  }>({
    formaEntrada: [],
    responsavel: [],
    requerido: [],
    situacao: [],
    encaminhamento: [],
    pedidoManifestacao: [],
    contatoPrevio: [],
    evidencia: [],
  })

  // 🔹 Carrega o processo
  useEffect(() => {
    async function fetchProcesso() {
      try {
        const response = await fetch(`/api/processos/${processoId}`)
        if (!response.ok) throw new Error("Erro ao buscar processo")
        const data = await response.json()
        setProcesso(data)
        console.log("✅ Processo carregado:", data)
      } catch (error) {
        console.error("❌ Erro ao carregar processo:", error)
      }
    }
    fetchProcesso()
  }, [processoId])

  // 🔹 Carrega as listas auxiliares
  useEffect(() => {
    async function fetchLista(endpoint: string) {
      try {
        const response = await fetch(`/api/${endpoint}`)
        if (!response.ok) throw new Error(`Erro ao buscar ${endpoint}`)
        const data = await response.json()
        console.log(`✅ ${endpoint} carregado com sucesso!`, data)
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
        ] = await Promise.all([
          fetchLista("formaEntrada"),
          fetchLista("responsaveis"),
          fetchLista("requeridos"),
          fetchLista("situacoes"),
          fetchLista("encaminhamentos"),
          fetchLista("pedidosManifestacao"),
          fetchLista("contatosPrevios"),
          fetchLista("evidencias"),
        ])

        setListas({
          formaEntrada,
          responsavel,
          requerido,
          situacao,
          encaminhamento,
          pedidoManifestacao,
          contatoPrevio,
          evidencia,
        })

        console.log("🔄 Todas as listas carregadas!")
      } catch (error) {
        console.error("❌ Erro ao carregar listas:", error)
      } finally {
        setLoadingListas(false) // 🚀 Atualiza para indicar que os dados estão prontos
      }
    }
    fetchListas()
  }, [])

  // 🔹 Atualiza estado do processo ao modificar inputs
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setProcesso((prev) => ({ ...prev!, [event.target.name]: event.target.value }))
  }

  async function handleSave() {
    if (!processo) return

    const payload: ProcessoInput = {
      numero: processo!.numero,
      dataCriacao: new Date(processo!.dataCriacao).toISOString(),
      requerente: processo?.requerente,
      formaEntradaId: processo?.formaEntrada?.id ?? undefined,
      responsavelId: processo?.responsavel?.id ?? undefined,
      requeridoId: processo?.requerido?.id ?? undefined,
      situacaoId: processo?.situacao?.id ?? undefined,
      pedidoManifestacaoId: processo?.pedidoManifestacao?.id ?? undefined,
      contatoPrevioId: processo?.contatoPrevio?.id ?? undefined,
      evidenciaId: processo?.evidencia?.id ?? undefined,
      anonimo: processo?.anonimo ?? false,
    }

    await fetch(`/api/processos/${processoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    alert("✅ Processo atualizado com sucesso!")
  }

  if (!processo) return <Typography>Carregando Processo...</Typography>
  if (loadingListas) return <Typography>Carregando listas...</Typography>

  return (
    <Paper sx={{ p: 3, mx: "auto", mt: 2, maxWidth: 600 }}>
      {/* Chip de Anonimato */}
      <Box sx={{ display: "flex", justifyContent: "start", mb: 2 }}>
        <Chip
          label={processo.anonimo ? "Denúncia Anônima" : "Identificado"}
          color={processo.anonimo ? "error" : "primary"}
        />
      </Box>

      {/* Número do Processo */}
      <TextField
        fullWidth
        label="Número do Processo"
        value={processo.numero}
        disabled
        sx={{ mb: 2 }}
      />

      {/* Data de Criação */}
      <TextField
        fullWidth
        label="Data de Criação"
        value={new Date(processo.dataCriacao).toLocaleDateString()}
        disabled
        sx={{ mb: 2 }}
      />

      {/* Nome do Requerente */}
      <TextField
        fullWidth
        label="Requerente"
        name="requerente"
        value={processo.requerente || ""}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      {/* Campos Selecionáveis */}
      {[
        { key: "formaEntrada", label: "Forma de Entrada" },
        { key: "responsavel", label: "Responsável" },
        { key: "requerido", label: "Requerido" },
        { key: "situacao", label: "Situação" },
        { key: "encaminhamento", label: "Encaminhamento" },
        { key: "pedidoManifestacao", label: "Pedido de Manifestação" },
        { key: "contatoPrevio", label: "Contato Prévio" },
        { key: "evidencia", label: "Evidência" },
      ].map(({ key, label }) => {
        const lista = listas[key as keyof typeof listas] ?? []
        const selectedValue =
          lista.find(
            (item) =>
              (item as EnumData)?.id ===
              (processo[key as keyof ProcessoOutput] as EnumData)?.id
          )?.id || ""

        return (
          <FormControl fullWidth sx={{ mb: 2 }} key={key}>
            <InputLabel>{label}</InputLabel>
            <Select
              name={key}
              value={selectedValue}
              onChange={(e) => {
                const selectedItem = lista.find(
                  (item) => item.id === Number(e.target.value)
                )
                if (selectedItem) {
                  setProcesso((prev) => ({ ...prev!, [key]: selectedItem }))
                }
              }}
            >
              {lista.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      })}

      {/* Botão Salvar */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSave}
      >
        Salvar Alterações
      </Button>
    </Paper>
  )
}
