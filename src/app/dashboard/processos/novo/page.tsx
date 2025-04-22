"use client"

import ProcessoForm from "@/components/processo/ProcessoForm"
import { useNotification } from "@/context/NotificationProvider"
import usePode from "@/hooks/usePode"
import { useUsuarioIdLogado } from "@/hooks/useUsuarioIdLogado"
import { parseId } from "@/utils/parseId"
import { ProcessoInput } from "@anpd/shared-types"
import { ChevronLeft, SaveOutlined } from "@mui/icons-material"
import { Alert, AlertTitle, Button, Container, Stack, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

export default function NovoProcessoPage() {
  const router = useRouter()
  const { notify } = useNotification()
  const { pode, loading: loadingPerms } = usePode()
  const { loading: loadingUserId } = useUsuarioIdLogado()

  const methods = useForm<ProcessoInput>()
  const { handleSubmit } = methods

  const podeCadastrar = pode("Cadastrar", "Processo")

  const onSubmit = handleSubmit(async (dataFromForm) => {
    const payload = {
      ...dataFromForm,
      dataCriacao: new Date().toISOString(),
      formaEntradaId: parseId(dataFromForm.formaEntradaId),
      responsavelId: parseId(dataFromForm.responsavelId),
      situacaoId: parseId(dataFromForm.situacaoId),
      encaminhamentoId: parseId(dataFromForm.encaminhamentoId),
      pedidoManifestacaoId: parseId(dataFromForm.pedidoManifestacaoId),
      contatoPrevioId: parseId(dataFromForm.contatoPrevioId),
      evidenciaId: parseId(dataFromForm.evidenciaId),
      tipoReclamacaoId: parseId(dataFromForm.tipoReclamacaoId),
      requeridoId: parseId(dataFromForm.requeridoId),
      statusInterno: "NOVO", // ou "IMPORTADO" se vier do CSV
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
