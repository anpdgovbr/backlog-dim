import { z } from "zod"

// Mantido sem imports de enums diretos para evitar acoplamento desnecessário no client

/**
 * Schema Zod para validação do formulário (client-side) de Processo.
 *
 * - Aceita datas como `Date | null` e strings vazias transformadas para `null`.
 * - Define campos obrigatórios (numero, formaEntradaId, responsavelId, situacaoId).
 * - Fornece função utilitária para `defaultValues` do React Hook Form.
 */

const dateOrNull = z.union([z.date(), z.null()])

export const processoFormSchema = z.object({
  // obrigatórios
  numero: z.string().min(1, { message: "Número do processo é obrigatório" }),
  formaEntradaId: z
    .union([z.number().int().positive(), z.null()])
    .superRefine((val, ctx) => {
      if (val === null)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Forma de entrada é obrigatória",
        })
    }),
  responsavelId: z
    .union([z.number().int().positive(), z.null()])
    .superRefine((val, ctx) => {
      if (val === null)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Responsável é obrigatório",
        })
    }),
  situacaoId: z.union([z.number().int().positive(), z.null()]).superRefine((val, ctx) => {
    if (val === null)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Situação é obrigatória" })
  }),

  // opcionais
  anonimo: z.boolean().default(false),
  requerente: z.string().default(""),
  requeridoId: z.number().int().positive().nullable().default(null),
  requeridoFinalId: z.number().int().positive().nullable().default(null),
  pedidoManifestacaoId: z.number().int().positive().nullable().default(null),
  contatoPrevioId: z.number().int().positive().nullable().default(null),
  evidenciaId: z.number().int().positive().nullable().default(null),
  encaminhamentoId: z.number().int().positive().nullable().default(null),
  tipoReclamacaoId: z.number().int().positive().nullable().default(null),
  prazoPedido: z.number().int().nullable().default(null),
  dataConclusao: dateOrNull.default(null),
  dataEnvioPedido: dateOrNull.default(null),
  temaRequerimento: z.array(z.string()).default([]),
  resumo: z.string().default(""),
  observacoes: z.string().default(""),
  statusInterno: z
    .union([
      z.enum(["IMPORTADO", "NOVO", "EM_PROCESSAMENTO", "PROCESSADO", "CONSOLIDADO"]),
      z.null(),
    ])
    .default(null),
  tipoRequerimento: z
    .union([z.enum(["PETICAO_TITULAR", "DENUNCIA_LGPD"]), z.literal("")])
    .nullable()
    .default(null),
})

export type ProcessoFormData = z.input<typeof processoFormSchema>

/**
 * Retorna os valores padrão do formulário de Processo para uso no `useForm`.
 */
export function getProcessoDefaultValues(): ProcessoFormData {
  return {
    numero: "",
    formaEntradaId: null,
    responsavelId: null,
    situacaoId: null,
    anonimo: false,
    requerente: "",
    requeridoId: null,
    requeridoFinalId: null,
    pedidoManifestacaoId: null,
    contatoPrevioId: null,
    evidenciaId: null,
    encaminhamentoId: null,
    tipoReclamacaoId: null,
    prazoPedido: null,
    dataConclusao: null,
    dataEnvioPedido: null,
    temaRequerimento: [],
    resumo: "",
    observacoes: "",
    statusInterno: null,
    tipoRequerimento: "",
  } as unknown as ProcessoFormData
}
