"use client"

import { ProcessoOutput } from "@/types/Processo"
import { Box, Chip, Grid, TextField, Typography } from "@mui/material"
import { FormProvider, useForm } from "react-hook-form"

import { MetaDropdownSection } from "../select/MetaDropdownSection"

export default function ProcessoForm({
  processo,
  setProcesso,
}: {
  processo: ProcessoOutput | null
  setProcesso: (data: ProcessoOutput) => void
}) {
  const methods = useForm()

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setProcesso({ ...processo!, [event.target.name]: event.target.value })
  }

  if (!processo) return <Typography>Carregando Processo...</Typography>

  return (
    <FormProvider {...methods}>
      <form>
        <Box sx={{ maxWidth: "lg", pb: 2 }}>
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
            <Grid item xs={12} sm={6}>
              <MetaDropdownSection
                entidade="formaentrada"
                label="Forma de Entrada"
                name="formaEntrada"
                defaultValue={processo.formaEntrada?.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetaDropdownSection
                entidade="responsavel"
                label="Responsável"
                name="responsavel"
                defaultValue={processo.responsavel?.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetaDropdownSection
                entidade="situacao"
                label="Situação"
                name="situacao"
                defaultValue={processo.situacao?.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetaDropdownSection
                entidade="encaminhamento"
                label="Encaminhamento"
                name="encaminhamento"
                defaultValue={processo.encaminhamento?.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetaDropdownSection
                entidade="pedidomanifestacao"
                label="Pedido de Manifestação"
                name="pedidoManifestacao"
                defaultValue={processo.pedidoManifestacao?.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetaDropdownSection
                entidade="contatoprevio"
                label="Contato Prévio"
                name="contatoPrevio"
                defaultValue={processo.contatoPrevio?.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetaDropdownSection
                entidade="evidencia"
                label="Evidência"
                name="evidencia"
                defaultValue={processo.evidencia?.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetaDropdownSection
                entidade="tiporeclamacao"
                label="Tipo de Reclamação"
                name="tipoReclamacao"
                defaultValue={processo.tipoReclamacao?.id}
              />
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  )
}
