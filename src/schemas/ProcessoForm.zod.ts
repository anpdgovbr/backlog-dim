import { z } from "zod"

// Mantido sem imports de enums diretos para evitar acoplamento desnecessário no client

/**
 * Validator Zod que aceita uma Date válida ou null.
 *
 * Uso: utilizado para representar campos de data opcionais no formulário,
 * garantindo que o valor seja ou uma instância Date ou null.
 */
const dateOrNull = z.union([z.date(), z.null()])

const uuidOrNull = z.union([z.string().uuid(), z.null()])

/**
 * Schema Zod para o formulário de criação/edição de Processo.
 *
 * Valida os campos do formulário no cliente antes do envio:
 * - Campos obrigatórios: numero, formaEntradaId, responsavelId, situacaoId.
 * - Campos opcionais têm defaults apropriados (ex.: arrays vazios, null).
 * - Alguns campos usam superRefine para mensagens customizadas de validação.
 *
 * Observações:
 * - Não importa enums diretamente para evitar acoplamento no client.
 * - Pode ser usado com react-hook-form via zodResolver.
 */
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
  requeridoId: uuidOrNull.default(null),
  requeridoFinalId: uuidOrNull.default(null),
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

/**
 * Tipo usado pelo formulário (input) derivado do schema `processoFormSchema`.
 *
 * Representa a forma esperada dos valores que o formulário recebe/retorna,
 * compatível com `z.input<typeof processoFormSchema>`.
 */
export type ProcessoFormData = z.input<typeof processoFormSchema>

/**
 * Retorna os valores padrão para inicializar o `useForm` do React Hook Form.
 *
 * O retorno segue o tipo `ProcessoFormData` e provê defaults seguros:
 * - Strings vazias para campos textuais,
 * - null para selects/ids opcionais,
 * - arrays vazios para listas (temaRequerimento), etc.
 *
 * Uso:
 * const form = useForm<ProcessoFormData>({ defaultValues: getProcessoDefaultValues() })
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
