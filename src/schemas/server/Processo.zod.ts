/**
 * Schemas Zod para validação server-side do recurso Processo.
 *
 * Contém validações para criação (POST) e atualização (PUT),
 * tratando coerções de inteiros, datas ISO e enums.
 */
import { z } from "zod"

/**
 * Valida string ISO de data e transforma para `Date | null`.
 */
const isoDateToDateNullable = z
  .string()
  .datetime({ message: "Data inválida (esperado ISO)" })
  .nullable()
  .transform((v) => (v ? new Date(v) : null))

/**
 * Inteiro positivo (coerção a partir de string/number) e opcionalmente nulo.
 */
const intIdNullable = z.union([z.coerce.number().int().positive(), z.null()]).optional()

const uuidNullable = z.union([z.string().uuid(), z.null()]).optional()

/**
 * Schema base de campos aceitos para Processo (comuns a POST/PUT).
 */
export const processoBase = z.object({
  requerente: z.string().optional().nullable(),
  formaEntradaId: z.coerce
    .number()
    .int()
    .positive({ message: "formaEntradaId inválido" }),
  responsavelId: z.coerce.number().int().positive({ message: "responsavelId inválido" }),
  requeridoId: uuidNullable,
  requeridoFinalId: uuidNullable,
  situacaoId: z.coerce.number().int().positive({ message: "situacaoId inválido" }),
  encaminhamentoId: intIdNullable,
  pedidoManifestacaoId: intIdNullable,
  contatoPrevioId: intIdNullable,
  evidenciaId: intIdNullable,
  tipoReclamacaoId: intIdNullable,
  anonimo: z.boolean().optional().default(false),
  observacoes: z.string().optional().nullable(),
  temaRequerimento: z.array(z.string()).optional().default([]),
  resumo: z.string().optional().nullable(),
  dataConclusao: isoDateToDateNullable.optional(),
  dataEnvioPedido: isoDateToDateNullable.optional(),
  // Importante: NÃO usar coerce aqui para que `null` permaneça `null` (sem virar 0)
  prazoPedido: z.union([z.number().int(), z.null()]).optional(),
  // prisma enum: TipoRequerimento | null
  tipoRequerimento: z
    .union([z.enum(["PETICAO_TITULAR", "DENUNCIA_LGPD"]), z.null()])
    .optional(),
  // statusInterno é controlado pelo sistema; aceitar apenas valores válidos quando enviado
  statusInterno: z
    .union([
      z.enum(["IMPORTADO", "NOVO", "EM_PROCESSAMENTO", "PROCESSADO", "CONSOLIDADO"]),
      z.null(),
    ])
    .optional(),
  // datas adicionais opcionais presentes no PUT
  dataVencimento: isoDateToDateNullable.optional(),
  processoStatusId: intIdNullable,
})

/**
 * Payload aceito no POST /api/processos.
 *
 * Observação: o campo `numero` é gerado no servidor e não deve ser enviado.
 */
export const processoCreateSchema = processoBase

/**
 * Payload aceito no PUT /api/processos/[id].
 *
 * Todos os campos são opcionais (atualização parcial), mas com tipos validados.
 */
export const processoUpdateSchema = processoBase.partial().extend({
  numero: z.string().optional(),
  dataCriacao: z
    .string()
    .datetime({ message: "Data inválida (esperado ISO)" })
    .optional(),
})

export type ProcessoCreateInput = z.infer<typeof processoCreateSchema>
export type ProcessoUpdateInput = z.infer<typeof processoUpdateSchema>
