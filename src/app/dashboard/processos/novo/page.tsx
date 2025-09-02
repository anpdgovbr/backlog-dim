"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useRouter } from "next/navigation"

import ChevronLeft from "@mui/icons-material/ChevronLeft"
import SaveOutlined from "@mui/icons-material/SaveOutlined"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { type ProcessoInput, StatusInterno } from "@anpdgovbr/shared-types"

import ProcessoForm from "@/components/processo/ProcessoForm"
import { useNotification } from "@/context/NotificationProvider"
import usePode from "@/hooks/usePode"
import { useUsuarioIdLogado } from "@/hooks/useUsuarioIdLogado"
import type { ProcessoFormData } from "@/schemas/ProcessoForm.zod"
import { getProcessoDefaultValues, processoFormSchema } from "@/schemas/ProcessoForm.zod"
import { safeToISO } from "@/utils/date"

const defaultValues = getProcessoDefaultValues()

export default function NovoProcessoPage() {
  const router = useRouter()
  const { notify } = useNotification()
  const { pode, loading: loadingPerms } = usePode()
  const { loading: loadingUserId } = useUsuarioIdLogado()

  const methods = useForm<ProcessoFormData>({
    resolver: zodResolver(processoFormSchema),
    defaultValues,
  })

  const podeCadastrar = pode("Cadastrar", "Processo")

  const onSubmit = methods.handleSubmit(async (data) => {
    // Monta o payload do processo com os dados do formulário
    const payload: ProcessoInput = {
      numero: data.numero,
      tipoRequerimento:
        data.tipoRequerimento === "" || data.tipoRequerimento === null
          ? undefined
          : data.tipoRequerimento,
      responsavelId: data.responsavelId ?? 0,
      formaEntradaId: data.formaEntradaId ?? undefined,
      situacaoId: data.situacaoId ?? undefined,
      dataCriacao: new Date().toISOString(),
      statusInterno: StatusInterno.NOVO,

      requerente: data.requerente,
      anonimo: data.anonimo,
      resumo: data.resumo,
      observacoes: data.observacoes,
      temaRequerimento: data.temaRequerimento,

      requeridoId: data.requeridoId ?? undefined,
      requeridoFinalId: data.requeridoFinalId ?? undefined,
      pedidoManifestacaoId: data.pedidoManifestacaoId ?? undefined,
      contatoPrevioId: data.contatoPrevioId ?? undefined,
      evidenciaId: data.evidenciaId ?? undefined,
      encaminhamentoId: data.encaminhamentoId ?? undefined,
      tipoReclamacaoId: data.tipoReclamacaoId ?? undefined,
      prazoPedido: data.prazoPedido ?? undefined,

      dataEnvioPedido: safeToISO(data.dataEnvioPedido),
      dataConclusao: safeToISO(data.dataConclusao),
    }

    const res = await fetch("/api/processos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      notify({ type: "success", message: "Processo criado com sucesso" })
      router.push("/dashboard/processos")
    } else {
      notify({ type: "error", message: "Erro ao criar o processo" })
      console.error("Erro ao criar processo:", res)
    }
  })

  if (loadingUserId || loadingPerms) {
    return <Typography>Carregando...</Typography>
  }

  if (!podeCadastrar) {
    return (
      <Alert variant="filled" severity="error" sx={{ m: 2 }}>
        <AlertTitle>Erro de Permissão</AlertTitle>
        Você não tem permissão para criar processos.
      </Alert>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Novo Processo
      </Typography>

      <ProcessoForm methods={methods} />

      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Button
          startIcon={<ChevronLeft />}
          variant="outlined"
          onClick={() => router.push("/dashboard/processos")}
        >
          Cancelar
        </Button>
        <Button
          startIcon={<SaveOutlined />}
          variant="contained"
          color="primary"
          onClick={onSubmit}
        >
          Salvar Processo
        </Button>
      </Stack>
    </Container>
  )
}
