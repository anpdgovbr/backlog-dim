import type {
  AcaoPermissao,
  PermissaoConcedida,
  RecursoPermissao,
} from "@anpdgovbr/shared-types"

import { pode as podeFn } from "@/lib/permissoes"

import usePermissoes from "./usePermissoes"

export default function usePode() {
  const { permissoes, loading } = usePermissoes()

  function pode(acao: AcaoPermissao, recurso: RecursoPermissao): boolean {
    const chave = `${acao}_${recurso}` as PermissaoConcedida
    return podeFn(permissoes, chave)
  }

  return { pode, loading }
}
