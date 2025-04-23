import { useNotification } from "@/context/NotificationProvider"
import { toProcessoInput } from "@/types/Processo"
import { parseId } from "@/utils/parseId"
import type { ProcessoInput, ProcessoOutput } from "@anpd/shared-types"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { GovBRInputModal } from "../modal/GovBRModal"
import ProcessoForm from "./ProcessoForm"

export default function ModalEditarProcesso({
  open,
  onClose,
  processoId,
}: {
  open: boolean
  onClose: () => void
  processoId: number | null
}) {
  const [processo, setProcesso] = useState<ProcessoOutput | null>(null)

  const defaultValues = useMemo(() => {
    return processo ? toProcessoInput(processo) : undefined
  }, [processo])

  const { notify } = useNotification()

  const methods = useForm<ProcessoInput>({ defaultValues })
  const { reset } = methods

  const handleSubmit = methods.handleSubmit((dataFromForm) => {
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

    fetch(`/api/processos/${processo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.ok) {
        notify({ type: "success", message: "Processo atualizado com sucesso" })
        onClose()
      } else {
        notify({ type: "error", message: "Erro ao atualizar o processo" })
        console.error("Erro ao atualizar o processo:", res)
      }
    })
  })

  useEffect(() => {
    async function fetchProcesso() {
      if (!processoId) return
      const res = await fetch(`/api/processos/${processoId}`)
      const data = await res.json()
      setProcesso(data)
    }
    if (open && processoId) fetchProcesso()
  }, [open, processoId])

  useEffect(() => {
    if (processo) {
      reset(toProcessoInput(processo))
    }
  }, [processo, reset])

  return (
    <GovBRInputModal
      sx={{ minWidth: 600 }}
      open={open}
      onClose={onClose}
      title="Editar Processo"
      confirmText="Salvar Alterações"
      onSubmit={handleSubmit}
      disabled={!processo}
    >
      {processo && <ProcessoForm processo={processo} methods={methods} />}
    </GovBRInputModal>
  )
}
