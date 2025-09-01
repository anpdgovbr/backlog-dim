"use client"

import useSWR from "swr"
import { withPermissao } from "../../../rbac/packages/rbac-react/src"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function RbacAdminPage() {
  const { data, error, isLoading } = useSWR("/api/perfis", fetcher)

  return (
    <div style={{ padding: 24 }}>
      <h1>RBAC Admin (preview)</h1>
      <p>Protótipo inicial para gerenciar Perfis, Herança e Permissões.</p>

      <h2>Perfis ativos</h2>
      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro ao carregar perfis</p>}
      {Array.isArray(data) && data.length > 0 ? (
        <ul>
          {data.map((p: any) => (
            <li key={p.id}>{p.nome}</li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>Nenhum perfil encontrado.</p>
      )}

      <hr />
      <h2>Próximos passos</h2>
      <ul>
        <li>Listar e editar herança de perfis</li>
        <li>Listar e editar permissões por perfil</li>
        <li>Aplicar proteção de rota com permissões administrativas</li>
      </ul>
    </div>
  )
}

export default withPermissao(RbacAdminPage, "Exibir", "Permissoes", { redirect: false })
