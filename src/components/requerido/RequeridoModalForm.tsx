"use client"

import { Typography } from "@mui/material"
import dynamic from "next/dynamic"

import GenericFormDialog from "../modal/GenericFormDialog"

const LazyRequeridoForm = dynamic(() => import("./RequeridoForm"), {
  ssr: false,
  loading: () => <Typography>Carregando formulário...</Typography>,
})

interface Props {
  open: boolean
  onClose: () => void
  requeridoId: number | null
  mutate?: () => void
}

export default function RequeridoModalForm({
  open,
  onClose,
  requeridoId,
  mutate,
}: Props) {
  const title = requeridoId ? "Editar Requerido" : "Novo Requerido"
  return (
    <GenericFormDialog
      open={open}
      onClose={onClose}
      title={title}
      contentSx={{ maxHeight: "70vh", overflowY: "auto" }}
      paperSx={{ overflowY: "visible" }}
      showDefaultActions
    >
      <LazyRequeridoForm requeridoId={requeridoId} mutate={mutate} onSave={onClose} />
    </GenericFormDialog>
  )
}
