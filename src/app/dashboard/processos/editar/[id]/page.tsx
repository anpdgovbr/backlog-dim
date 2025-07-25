"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import type { TipoRequerimento } from "@prisma/client"
import { isEqual } from "lodash"
import { useForm } from "react-hook-form"

import { useEffect, useMemo } from "react"

import { useParams, useRouter } from "next/navigation"

import ChevronLeft from "@mui/icons-material/ChevronLeft"
import SaveOutlined from "@mui/icons-material/SaveOutlined"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import type { ProcessoInput } from "@anpdgovbr/shared-types"
import { StatusInterno } from "@anpdgovbr/shared-types"

import ProcessoForm from "@/components/processo/ProcessoForm"
import { useNotification } from "@/context/NotificationProvider"
import usePode from "@/hooks/usePode"
import useProcessoById from "@/hooks/useProcessoById"
import { useUsuarioIdLogado } from "@/hooks/useUsuarioIdLogado"
import type { ProcessoFormData } from "@/schemas/ProcessoSchema"
import { processoSchema } from "@/schemas/ProcessoSchema"
import { toProcessoInput } from "@/types/Processo"
import { safeToISO } from "@/utils/date"

export default function EditarProcessoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { notify } = useNotification()
  const { pode, loading: loadingPerms } = usePode()
  const { userId, loading: loadingUserId } = useUsuarioIdLogado()
  const { processo, isLoading, mutate } = useProcessoById(id)

  const methods = useForm<ProcessoFormData>({
    resolver: yupResolver(processoSchema),
  })
  const { reset, handleSubmit } = methods
  const defaultValues = useMemo(() => {
    return processo ? toProcessoInput(processo) : undefined
  }, [processo])

  const isAlterado = !isEqual(methods.getValues(), defaultValues)

  const podeEditar =
    pode("EditarGeral", "Processo") ||
    (pode("EditarProprio", "Processo") &&
      userId != null &&
      processo?.responsavel?.userId === userId)

  const onSubmit = handleSubmit(async (dataFromForm) => {
    if (!processo) return

    // Atualiza statusInterno se o processo estiver em fase inicial
    const atualizarStatusInterno =
      isAlterado &&
      (processo.statusInterno === "IMPORTADO" || processo.statusInterno === "NOVO")

    const payload: ProcessoInput = {
      ...dataFromForm,
      numero: processo.numero,
      dataCriacao: new Date(processo.dataCriacao).toISOString(),
      anonimo: processo.anonimo,

      tipoRequerimento: dataFromForm.tipoRequerimento as TipoRequerimento,
      responsavelId: dataFromForm.responsavelId ?? 0,
      formaEntradaId: dataFromForm.formaEntradaId ?? undefined,
      situacaoId: dataFromForm.situacaoId ?? undefined,

      requerente: dataFromForm.requerente,
      resumo: dataFromForm.resumo,
      observacoes: dataFromForm.observacoes,
      statusInterno: dataFromForm.statusInterno as undefined | StatusInterno,
      temaRequerimento: dataFromForm.temaRequerimento,

      requeridoId: dataFromForm.requeridoId ?? undefined,
      requeridoFinalId: dataFromForm.requeridoFinalId ?? undefined,
      pedidoManifestacaoId: dataFromForm.pedidoManifestacaoId ?? undefined,
      contatoPrevioId: dataFromForm.contatoPrevioId ?? undefined,
      evidenciaId: dataFromForm.evidenciaId ?? undefined,
      encaminhamentoId: dataFromForm.encaminhamentoId ?? undefined,
      tipoReclamacaoId: dataFromForm.tipoReclamacaoId ?? undefined,
      prazoPedido: dataFromForm.prazoPedido ?? undefined,

      dataEnvioPedido: safeToISO(dataFromForm.dataEnvioPedido),
      dataConclusao: safeToISO(dataFromForm.dataConclusao),

      ...(atualizarStatusInterno && {
        statusInterno: StatusInterno.EM_PROCESSAMENTO,
      }),
    }

    const res = await fetch(`/api/processos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      notify({ type: "success", message: "Processo atualizado com sucesso" })
      mutate()
    } else {
      notify({ type: "error", message: "Erro ao atualizar o processo" })
      console.error("Erro ao atualizar o processo:", res)
    }
  })

  useEffect(() => {
    if (processo) {
      const toNumberOrNull = (value: unknown): number | null =>
        value == null || value === "" ? null : Number(value)

      // Popula o formulário com os dados do processo carregado
      const formData: ProcessoFormData = {
        numero: processo.numero,
        requerente: processo.requerente ?? "",
        anonimo: processo.anonimo ?? false,
        resumo: processo.resumo ?? "",
        observacoes: processo.observacoes ?? "",
        temaRequerimento: processo.temaRequerimento ?? [],
        statusInterno: processo.statusInterno ?? null,
        tipoRequerimento: processo.tipoRequerimento ?? "",
        formaEntradaId: toNumberOrNull(processo.formaEntrada?.id),
        responsavelId: toNumberOrNull(processo.responsavel?.id),
        situacaoId: toNumberOrNull(processo.situacao?.id),
        requeridoId: toNumberOrNull(processo.requerido?.id),
        requeridoFinalId: toNumberOrNull(processo.requeridoFinal?.id),
        encaminhamentoId: toNumberOrNull(processo.encaminhamento?.id),
        pedidoManifestacaoId: toNumberOrNull(processo.pedidoManifestacao?.id),
        contatoPrevioId: toNumberOrNull(processo.contatoPrevio?.id),
        evidenciaId: toNumberOrNull(processo.evidencia?.id),
        tipoReclamacaoId: toNumberOrNull(processo.tipoReclamacao?.id),
        prazoPedido: processo.prazoPedido ?? null,
        dataEnvioPedido: processo.dataEnvioPedido
          ? new Date(processo.dataEnvioPedido)
          : null,
        dataConclusao: processo.dataConclusao ? new Date(processo.dataConclusao) : null,
      }

      reset(formData)
    }
  }, [processo, reset])

  if (isLoading || loadingUserId || loadingPerms) {
    return <Typography>Carregando...</Typography>
  }

  if (!processo) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Alert severity="error">Processo não encontrado.</Alert>
      </Container>
    )
  }

  if (!podeEditar) {
    return (
      <Alert variant="filled" severity="error" sx={{ m: 2 }}>
        <AlertTitle>Erro de Permissão</AlertTitle>
        Você não tem permissão para editar este processo.
      </Alert>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Processo
      </Typography>

      <ProcessoForm processo={processo} methods={methods} />

      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Button
          startIcon={<ChevronLeft />}
          variant="outlined"
          onClick={() => router.push("/dashboard/processos")}
        >
          Voltar aos processos
        </Button>
        <Button
          startIcon={<SaveOutlined />}
          variant="contained"
          color="primary"
          onClick={onSubmit}
        >
          Salvar Alterações
        </Button>
      </Stack>
    </Container>
  )
}
