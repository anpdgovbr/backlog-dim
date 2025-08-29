import type { TipoRequerimento } from "@prisma/client"
import * as Yup from "yup"

import { StatusInterno } from "@anpdgovbr/shared-types"

/**
 * Validador reutilizável para campos numéricos que são obrigatórios no formulário
 * mas podem inicialmente estar representados como `null`.
 *
 * Retorna um schema Yup.number() com:
 * - nullable() e default(null) para aceitar valores nulos como estado inicial;
 * - um teste customizado chamado "required" que falha caso o valor seja `null` ou `undefined`.
 *
 * @param message Mensagem de erro a ser exibida quando o campo for considerado obrigatório.
 * @returns Um schema Yup.NumberSchema configurado com comportamento de "obrigatório tolerante a null".
 */
/**
 * Validador personalizado para campos numéricos que podem iniciar como `null`.
 *
 * O schema resultante aceita `null` como estado inicial (útil em formulários) e
 * aplica um teste customizado chamado `required` que falha quando o campo é
 * `null` ou `undefined`.
 *
 * @param message Mensagem de erro quando o campo for considerado obrigatório.
 * @returns Um schema Yup.NumberSchema configurado com nullable/default e teste "required".
 *
 * @example
 * const formaEntradaSchema = requiredIdTest("A forma de entrada é obrigatória")
 */
const requiredIdTest = (message: string) =>
  Yup.number()
    .nullable()
    .default(null)
    .test("required", message, (value) => value != null)

/**
 * Schema Yup para validação do formulário de criação/edição de um processo.
 *
 * - Define campos obrigatórios (ex.: numero, formaEntradaId, responsavelId, situacaoId)
 *   e vários campos opcionais com valores default adequados.
 * - Trata conversões de data para aceitar strings vazias como `null`.
 * - Limita `statusInterno` aos valores do enum StatusInterno.
 * - Usa Tipos do Prisma (`TipoRequerimento`) para tipar o campo `tipoRequerimento`.
 *
 * Observações:
 * - Este schema é utilizado para validação em formulários (react-hook-form, etc.).
 * - Campos que podem começar em null utilizam `requiredIdTest` para permitir este estado inicial
 *   e ainda assim validar como obrigatórios quando necessário.
 */
/**
 * Schema Yup para validação do formulário de criação/edição de um processo.
 *
 * Principais características:
 * - Campos obrigatórios: `numero`, `formaEntradaId`, `responsavelId`, `situacaoId`.
 * - Campos opcionais com valores default apropriados (ex.: arrays vazios, `null`, `false`).
 * - Conversões de data para aceitar strings vazias como `null`.
 * - `statusInterno` limitado aos valores do enum `StatusInterno`.
 * - `tipoRequerimento` tipado via Prisma (`TipoRequerimento`).
 *
 * @remarks
 * Use este schema com `react-hook-form` via `yupResolver` para garantir coerência
 * entre validação e tipagem. O tipo `ProcessoFormData` é inferido automaticamente
 * a partir deste schema.
 *
 * @example
 * // Exemplo com react-hook-form
 * // const methods = useForm<ProcessoFormData>({ resolver: yupResolver(processoSchema) })
 */
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

/**
 * Tipo TypeScript inferido automaticamente a partir de `processoSchema`.
 *
 * - Use este tipo para tipar os dados do formulário (por exemplo, react-hook-form).
 * - Por ser inferido diretamente do schema, garante coerência entre validação e tipagem.
 */
/**
 * Tipo TypeScript inferido automaticamente a partir de `processoSchema`.
 *
 * Use para tipar os dados do formulário, garantindo que a estrutura de dados
 * validada seja refletida na tipagem estática do TypeScript.
 *
 * @example
 * function onSubmit(data: ProcessoFormData) {
 *   // o campo `numero` está garantido como string, `requerente` pode ser string vazia, etc.
 * }
 */
export type ProcessoFormData = Yup.InferType<typeof processoSchema>
