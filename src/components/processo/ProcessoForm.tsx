"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormProvider, useWatch } from "react-hook-form"

import Checkbox from "@mui/material/Checkbox"
import Chip from "@mui/material/Chip"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import type { ProcessoOutput } from "@anpdgovbr/shared-types"

import type { ProcessoFormData } from "@/schemas/ProcessoForm.zod"
import { adicionarDiasUteis } from "@/utils/date"
import { definirCorStatusInterno, formatarStatusInterno } from "@/utils/statusInterno"

import FormDateField from "../form/FormDateField"
import FormTagsInput from "../form/FormTagsInput"
import { MetaDropdownSection } from "../select/MetaDropdownSection"
import { RequeridoDropdownSection } from "../select/RequeridoDropdownSection"

/**
 * Props do componente `ProcessoForm`.
 *
 * Use este componente para renderizar o formulário de criação/edição de um
 * processo. Recebe os métodos do react-hook-form para integração com validação
 * e envio.
 *
 * @example
 *
 * @remarks
 * Os campos são compostos por seções (Dados Principais, Identificação, Fluxo,
 * Prazos e Complementares). Quando `processo` é fornecido o formulário passa
 * para o modo de edição e exibe informações de status; caso contrário exibe
 * campos para criação. O componente depende de `ProcessoFormData` para o
 * tipo dos métodos do `react-hook-form`.
 *
 * @example
 * ```tsx
 * const methods = useForm<ProcessoFormData>()
 * <ProcessoForm methods={methods} />
 * ```
 * <ProcessoForm
 *   processo={processoExistente}
 *   methods={methods}
 * />
 */
export interface ProcessoFormProps
  extends Readonly<{
    processo?: ProcessoOutput
    methods: UseFormReturn<ProcessoFormData>
  }> {}

/**
 * Formulário de Processo (criação/edição).
 *
 * O componente encapsula campos principais, identificação e fluxo do processo
 * e expõe o comportamento padrão de um formulário controlado pelo
 * `react-hook-form` através de `methods`.
 *
 * @remarks
 * Organização das seções:
 * - Dados Principais
 * - Identificação
 * - Fluxo do Processo
 * - Prazos
 * - Informações Complementares
 *
 * Recebe `methods` do `react-hook-form` para controle e validação. Quando o
 * prop `processo` é informado, o formulário entra em modo de edição.
 *
 * @example
 * ```tsx
 * const methods = useForm<ProcessoFormData>()
 * <ProcessoForm methods={methods} />
 * ```
 */
export default function ProcessoForm({ processo, methods }: ProcessoFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = methods
  const emModoEdicao = Boolean(processo)
  const dataEnvio = useWatch({ name: "dataEnvioPedido", control }) as Date | null
  const prazoPedido = useWatch({ name: "prazoPedido", control }) as number | null

  let dataVencimentoCalculada = ""
  if (dataEnvio && prazoPedido) {
    const parsedDate = new Date(dataEnvio)
    if (!isNaN(parsedDate.getTime())) {
      const vencimento = adicionarDiasUteis(parsedDate, Number(prazoPedido))
      dataVencimentoCalculada = vencimento.toLocaleDateString("pt-BR")
    }
  }

  return (
    <FormProvider {...methods}>
      <form noValidate>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {emModoEdicao ? (
            <Chip
              sx={{ boxShadow: 2 }}
              label={processo?.anonimo ? "Denúncia Anônima" : "Identificado"}
              color={processo?.anonimo ? "error" : "primary"}
            />
          ) : (
            <FormControlLabel
              control={<Checkbox {...register("anonimo")} />}
              label="Denúncia Anônima?"
            />
          )}

          {/* Chip de Status Interno */}
          <Chip
            sx={{ boxShadow: 2 }}
            label={formatarStatusInterno(emModoEdicao ? processo?.statusInterno : "NOVO")}
            color={definirCorStatusInterno(
              emModoEdicao ? processo?.statusInterno : "NOVO"
            )}
          />
        </Stack>

        {/* Seção de Dados Principais */}
        <Paper elevation={2} sx={{ p: 1, mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Dados Principais
          </Typography>
          <Grid container spacing={1}>
            {!emModoEdicao && (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  {...register("numero")}
                  label="Número do Processo"
                  fullWidth
                  size="small"
                  error={!!errors.numero}
                  helperText={errors.numero?.message}
                />
              </Grid>
            )}
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <MetaDropdownSection
                entidade="responsavel"
                name="responsavelId"
                label="Responsável"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <MetaDropdownSection
                entidade="formaentrada"
                name="formaEntradaId"
                label="Forma de Entrada"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <MetaDropdownSection
                entidade="situacao"
                name="situacaoId"
                label="Situação"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Seção de Identificação */}
        <Paper elevation={2} sx={{ p: 1, mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Identificação
          </Typography>
          <Grid container spacing={1}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                {...register("requerente")}
                label="Requerente"
                fullWidth
                size="small"
                error={!!errors.requerente}
                helperText={errors.requerente?.message}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                {...register("tipoRequerimento")}
                label="Tipo de Requerimento"
                fullWidth
                select
                size="small"
                slotProps={{ select: { native: true } }}
                error={!!errors.tipoRequerimento}
                helperText={errors.tipoRequerimento?.message}
              >
                <option value=""></option>
                <option value="PETICAO_TITULAR">Petição de Titular</option>
                <option value="DENUNCIA_LGPD">Denúncia LGPD</option>
              </TextField>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <RequeridoDropdownSection label="Requerido" name="requeridoId" />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <RequeridoDropdownSection
                label="Requerido Pós Análise"
                name="requeridoFinalId"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Seção de Fluxo do Processo */}
        <Paper elevation={2} sx={{ p: 1, mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Fluxo do Processo
          </Typography>
          <Grid container spacing={1}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <MetaDropdownSection
                entidade="pedidomanifestacao"
                name="pedidoManifestacaoId"
                label="Pedido de Manifestação"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <MetaDropdownSection
                entidade="contatoprevio"
                name="contatoPrevioId"
                label="Contato Prévio"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <MetaDropdownSection
                entidade="evidencia"
                name="evidenciaId"
                label="Evidência"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <MetaDropdownSection
                entidade="encaminhamento"
                name="encaminhamentoId"
                label="Encaminhamento"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <MetaDropdownSection
                entidade="tiporeclamacao"
                name="tipoReclamacaoId"
                label="Tipo de Reclamação"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Seção de Prazos */}
        <Paper elevation={2} sx={{ p: 1, mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Prazos
          </Typography>
          <Grid container spacing={1}>
            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <FormDateField name="dataEnvioPedido" label="Data de Envio do Pedido" />
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <TextField
                {...register("prazoPedido", { valueAsNumber: true })}
                label="Prazo (dias úteis)"
                type="number"
                fullWidth
                size="small"
                error={!!errors.prazoPedido}
                helperText={errors.prazoPedido?.message}
              />
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <TextField
                label="Data de Vencimento (calculada)"
                value={dataVencimentoCalculada}
                fullWidth
                size="small"
                disabled
              />
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <FormDateField name="dataConclusao" label="Data de Conclusão" />
            </Grid>
          </Grid>
        </Paper>

        {/* Seção de Complementares */}
        <Paper elevation={2} sx={{ p: 1, mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Informações Complementares
          </Typography>
          <Grid container spacing={1}>
            <Grid size={12}>
              <FormTagsInput
                name="temaRequerimento"
                label="Tema / Tags do Requerimento"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                {...register("resumo")}
                label="Resumo do Requerimento"
                fullWidth
                multiline
                rows={3}
                size="small"
                error={!!errors.resumo}
                helperText={errors.resumo?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                {...register("observacoes")}
                label="Observações"
                multiline
                fullWidth
                size="small"
                rows={2}
                error={!!errors.observacoes}
                helperText={errors.observacoes?.message}
              />
            </Grid>
          </Grid>
        </Paper>
      </form>
    </FormProvider>
  )
}
