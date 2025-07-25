import type { TipoRequerimento } from "@prisma/client"
import * as Yup from "yup"

import { StatusInterno } from "@anpdgovbr/shared-types"

// Validador reutilizável para campos numéricos obrigatórios que podem começar como null
const requiredIdTest = (message: string) =>
  Yup.number()
    .nullable()
    .default(null)
    .test("required", message, (value) => value != null)

export const processoSchema = Yup.object({
  // === Campos obrigatórios ===
  numero: Yup.string().required("O número do processo é obrigatório."),
  formaEntradaId: requiredIdTest("A forma de entrada é obrigatória."),
  responsavelId: requiredIdTest("O responsável é obrigatório."),
  situacaoId: requiredIdTest("A situação é obrigatória."),

  // === Campos opcionais ===
  anonimo: Yup.boolean().default(false),
  requerente: Yup.string().default(""),
  requeridoId: Yup.number().nullable().default(null),
  requeridoFinalId: Yup.number().nullable().default(null),
  pedidoManifestacaoId: Yup.number().nullable().default(null),
  contatoPrevioId: Yup.number().nullable().default(null),
  evidenciaId: Yup.number().nullable().default(null),
  encaminhamentoId: Yup.number().nullable().default(null),
  tipoReclamacaoId: Yup.number().nullable().default(null),
  prazoPedido: Yup.number().nullable().default(null),
  dataConclusao: Yup.date()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value
    })
    .nullable()
    .default(null),
  temaRequerimento: Yup.array(Yup.string().defined()).default([]),
  resumo: Yup.string().default(""),
  observacoes: Yup.string().default(""),
  statusInterno: Yup.string()
    .oneOf(Object.values(StatusInterno))
    .nullable()
    .default(null),
  dataEnvioPedido: Yup.date()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value
    })
    .nullable()
    .default(null)
    .typeError("A data de envio do pedido é inválida"),
  tipoRequerimento: Yup.mixed<TipoRequerimento | "">().nullable().default(null),
})

// Tipo inferido automaticamente a partir do schema
export type ProcessoFormData = Yup.InferType<typeof processoSchema>
