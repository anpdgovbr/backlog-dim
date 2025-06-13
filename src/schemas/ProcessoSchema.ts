import { TipoRequerimento } from "@prisma/client"
import * as Yup from "yup"

// Este schema define as regras de validação para o formulário de processo.
export const processoSchema = Yup.object().shape({
  numero: Yup.string().required("O número do processo é obrigatório."),
  formaEntradaId: Yup.number()
    .typeError("Selecione uma forma de entrada.")
    .required("A forma de entrada é obrigatória."),
  responsavelId: Yup.number()
    .typeError("Selecione um responsável.")
    .required("O responsável é obrigatório."),
  situacaoId: Yup.number()
    .typeError("Selecione uma situação válida.")
    .required("A situação é obrigatória."),
  tipoRequerimento: Yup.mixed<TipoRequerimento>()
    .oneOf(Object.values(TipoRequerimento), "Selecione um tipo de requerimento válido.")
    .required("O tipo de requerimento é obrigatório."),
})

export type ProcessoFormData = Yup.InferType<typeof processoSchema>
