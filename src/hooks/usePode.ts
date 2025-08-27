import type { AcaoPermissao, RecursoPermissao } from "@anpdgovbr/shared-types"

import { pode as podeFn } from "@/lib/permissions"

import usePermissoes from "./usePermissoes"

export default function usePode() {
  const { permissoes, loading } = usePermissoes()

  function pode(acao: AcaoPermissao, recurso: RecursoPermissao): boolean {
    return podeFn(permissoes, acao, recurso)
  }

  return { pode, loading }
}
