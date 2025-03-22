import { ProcessoOutput } from "@/types/Processo"
import { useEffect, useState } from "react"

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

  useEffect(() => {
    async function fetchProcesso() {
      if (!processoId) return
      const res = await fetch(`/api/processos/${processoId}`)
      const data = await res.json()
      setProcesso(data)
    }
    if (open && processoId) fetchProcesso()
  }, [open, processoId])

  async function handleSave() {
    if (!processo || !processoId) return
    const payload = {
      numero: processo.numero,
      dataCriacao: new Date(processo.dataCriacao).toISOString(),
      requerente: processo.requerente,
      formaEntradaId: processo.formaEntrada?.id,
      responsavelId: processo.responsavel?.id,
      requeridoId: processo.requerido?.id,
      situacaoId: processo.situacao?.id,
      pedidoManifestacaoId: processo.pedidoManifestacao?.id,
      contatoPrevioId: processo.contatoPrevio?.id,
      evidenciaId: processo.evidencia?.id,
      anonimo: processo.anonimo,
      tipoReclamacaoId: processo.tipoReclamacao?.id,
    }

    const response = await fetch(`/api/processos/${processoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      alert("✅ Processo atualizado com sucesso!")
      onClose()
    } else {
      alert("❌ Erro ao atualizar o processo")
    }
  }

  return (
    <GovBRInputModal
      sx={{ minWidth: 600 }}
      open={open}
      onClose={onClose}
      title="Editar Processo"
      confirmText="Salvar Alterações"
      onSubmit={handleSave}
      disabled={!processo}
    >
      {processo && <ProcessoForm processo={processo} setProcesso={setProcesso} />}
    </GovBRInputModal>
  )
}
