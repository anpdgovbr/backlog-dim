import type { AcaoPermissao, RecursoPermissao } from "@anpdgovbr/shared-types"

import { pode as podeFn, type Action, type Resource } from "@anpdgovbr/rbac-core"

import usePermissoes from "./usePermissoes"

export default function usePode() {
  const { permissoes, loading } = usePermissoes()

  function pode(acao: AcaoPermissao, recurso: RecursoPermissao): boolean {
    return podeFn(permissoes, acao as unknown as Action, recurso as unknown as Resource)
  }

  return { pode, loading }
}
