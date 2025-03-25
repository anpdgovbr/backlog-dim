import { ProcessoInput, ProcessoOutput, toProcessoInput } from "@/types/Processo"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { GovBRInputModal } from "../GovBRModal"
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

  console.log(defaultValues)

  const methods = useForm<ProcessoInput>({ defaultValues })

  const handleSubmit = methods.handleSubmit((dataFromForm) => {
    if (!processo) return

    const payload = {
      ...dataFromForm,
      numero: processo.numero,
      dataCriacao: new Date(processo.dataCriacao).toISOString(),
      anonimo: processo.anonimo,
      formaEntradaId: dataFromForm.formaEntradaId,
      responsavelId: dataFromForm.responsavelId,
      situacaoId: dataFromForm.situacaoId,
      encaminhamentoId: dataFromForm.encaminhamentoId,
      pedidoManifestacaoId: dataFromForm.pedidoManifestacaoId,
      contatoPrevioId: dataFromForm.contatoPrevioId,
      evidenciaId: dataFromForm.evidenciaId,
      tipoReclamacaoId: dataFromForm.tipoReclamacaoId,
    }

    fetch(`/api/processos/${processo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.ok) {
        alert("✅ Processo atualizado com sucesso!")
        onClose()
      } else {
        alert("❌ Erro ao atualizar o processo")
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
      methods.reset(toProcessoInput(processo))
    }
  }, [processo])

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
