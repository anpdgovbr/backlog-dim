"use client"

import ProcessoForm from "@/components/processo/ProcessoForm"
import { useNotification } from "@/context/NotificationProvider"
import usePode from "@/hooks/usePode"
import { useUsuarioIdLogado } from "@/hooks/useUsuarioIdLogado"
import { ProcessoInput, ProcessoOutput, toProcessoInput } from "@/types/Processo"
import { parseId } from "@/utils/parseId"
import { ChevronLeft, SaveOutlined } from "@mui/icons-material"
import { Alert, AlertTitle, Button, Container, Stack, Typography } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import useSWR, { mutate } from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function EditarProcessoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { notify } = useNotification()
  const { pode, loading: loadingPerms } = usePode()
  const { userId, loading: loadingUserId } = useUsuarioIdLogado()

  const { data: processo, isLoading } = useSWR<ProcessoOutput>(
    id ? `/api/processos/${id}` : null,
    fetcher
  )

  const defaultValues = useMemo(() => {
    return processo ? toProcessoInput(processo) : undefined
  }, [processo])

  const methods = useForm<ProcessoInput>({ defaultValues })
  const { reset } = methods

  const podeEditar =
    pode("EditarGeral", "Processo") ||
    (pode("EditarProprio", "Processo") &&
      userId != null &&
      processo?.responsavel?.userId === userId)

  const handleSubmit = methods.handleSubmit(async (dataFromForm) => {
    if (!processo) return

    const payload = {
      ...dataFromForm,
      numero: processo.numero,
      dataCriacao: new Date(processo.dataCriacao).toISOString(),
      anonimo: processo.anonimo,
      formaEntradaId: parseId(dataFromForm.formaEntradaId),
      responsavelId: parseId(dataFromForm.responsavelId),
      situacaoId: parseId(dataFromForm.situacaoId),
      encaminhamentoId: parseId(dataFromForm.encaminhamentoId),
      pedidoManifestacaoId: parseId(dataFromForm.pedidoManifestacaoId),
      contatoPrevioId: parseId(dataFromForm.contatoPrevioId),
      evidenciaId: parseId(dataFromForm.evidenciaId),
      tipoReclamacaoId: parseId(dataFromForm.tipoReclamacaoId),
      requeridoId: parseId(dataFromForm.requeridoId),
      observacoes: dataFromForm.observacoes,
    }

    const res = await fetch(`/api/processos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      notify({ type: "success", message: "Processo atualizado com sucesso" })
      mutate(`/api/processos/${id}`)
    } else {
      notify({ type: "error", message: "Erro ao atualizar o processo" })
      console.error("Erro ao atualizar o processo:", res)
    }
  })

  useEffect(() => {
    if (processo) {
      reset(toProcessoInput(processo))
    }
  }, [processo, reset])

  if (isLoading || loadingUserId || loadingPerms || !processo) {
    return <Typography>Carregando...</Typography>
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
          onClick={handleSubmit}
        >
          Salvar Alterações
        </Button>
      </Stack>
    </Container>
  )
}
