import type { AcaoPermissao, RecursoPermissao } from "@anpdgovbr/shared-types"

import { pode as podeFn, type Action, type Resource } from "@anpdgovbr/rbac-core"

import usePermissoes from "./usePermissoes"

/**
 * Hook: usePode
 *
 * Verifica se o usuário logado possui permissão para executar uma ação sobre um recurso.
 *
 * Utiliza o hook `usePermissoes` para obter o mapa de permissões do usuário e delega a
 * avaliação para a função `pode` do pacote de RBAC.
 *
 * Exemplos de uso:
 * const { pode, loading } = usePode()
 * if (pode('read', 'usuarios')) { ... }
 *
 * @returns Readonly<{ pode: (acao: AcaoPermissao, recurso: RecursoPermissao) => boolean; loading: boolean }>
 * - pode(acao, recurso): função que retorna true se a ação sobre o recurso for permitida.
 * - loading: indica se as permissões ainda estão sendo carregadas.
 */
export default function usePode() {
  const { permissoes, loading } = usePermissoes()

  function pode(acao: AcaoPermissao, recurso: RecursoPermissao): boolean {
    return podeFn(permissoes, acao as unknown as Action, recurso as unknown as Resource)
  }

  return { pode, loading }
}
