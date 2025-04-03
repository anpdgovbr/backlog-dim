"use client"

import { ProcessoInput, ProcessoOutput } from "@/types/Processo"
import { Checkbox, Chip, FormControlLabel, Grid, TextField } from "@mui/material"
import { FormProvider, UseFormReturn } from "react-hook-form"

import { MetaDropdownSection } from "../select/MetaDropdownSection"
import { RequeridoDropdownSection } from "../select/RequeridoDropdownSection"

interface ProcessoFormProps {
  processo?: ProcessoOutput
  methods: UseFormReturn<ProcessoInput>
}

export default function ProcessoForm({ processo, methods }: ProcessoFormProps) {
  const { register } = methods

  const emModoEdicao = Boolean(processo)

  return (
    <FormProvider {...methods}>
      <form>
        {emModoEdicao ? (
          <Chip
            label={processo?.anonimo ? "Denúncia Anônima" : "Identificado"}
            color={processo?.anonimo ? "error" : "primary"}
            sx={{ mb: 2 }}
          />
        ) : (
          <FormControlLabel
            control={<Checkbox {...register("anonimo")} />}
            label="Denúncia Anônima?"
            sx={{ mb: 2 }}
          />
        )}

        <Grid container spacing={2}>
          {emModoEdicao && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  size="small"
                  label="Número"
                  value={processo?.numero ?? ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  size="small"
                  label="Data de Criação"
                  value={
                    processo?.dataCriacao
                      ? new Date(processo.dataCriacao).toLocaleDateString()
                      : ""
                  }
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              {...register("requerente")}
              label="Requerente"
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <RequeridoDropdownSection label="Requerido" name="requeridoId" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <MetaDropdownSection
              entidade="formaentrada"
              name="formaEntradaId"
              label="Forma de Entrada"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MetaDropdownSection
              entidade="responsavel"
              name="responsavelId"
              label="Responsável"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MetaDropdownSection entidade="situacao" name="situacaoId" label="Situação" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MetaDropdownSection
              entidade="encaminhamento"
              name="encaminhamentoId"
              label="Encaminhamento"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MetaDropdownSection
              entidade="pedidomanifestacao"
              name="pedidoManifestacaoId"
              label="Pedido de Manifestação"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MetaDropdownSection
              entidade="contatoprevio"
              name="contatoPrevioId"
              label="Contato Prévio"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MetaDropdownSection
              entidade="evidencia"
              name="evidenciaId"
              label="Evidência"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MetaDropdownSection
              entidade="tiporeclamacao"
              name="tipoReclamacaoId"
              label="Tipo de Reclamação"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("observacoes")}
              label="Observações"
              multiline
              fullWidth
              size="small"
              rows={2}
            />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}
