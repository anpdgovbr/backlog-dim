"use client"

import { withPermissao } from "@anpdgovbr/rbac-react"
import RbacAdminShell from "@anpdgovbr/rbac-admin"

function RbacAdminPage() {
  return (
    <RbacAdminShell
      config={{
        baseUrl: "",
        endpoints: {
          permissions: (id: string | number) => `/api/permissoes?perfil=${id}`,
          toggle: "/api/permissoes/toggle",
          profiles: "/api/perfis",
        },
      }}
    />
  )
}

export default withPermissao(RbacAdminPage, "Exibir", "Permissoes", { redirect: false })
