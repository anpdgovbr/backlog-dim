"use client"

import React from "react"
import { withPermissao } from "@anpdgovbr/rbac-react"
import RbacAdminShell from "@anpdgovbr/rbac-admin"

function RbacAdminClient(): JSX.Element {
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

export default withPermissao(RbacAdminClient, "Exibir", "Permissoes", { redirect: false })
