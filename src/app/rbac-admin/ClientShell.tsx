"use client"

import RbacAdminShell from "@anpdgovbr/rbac-admin"

/**
 * Componente client-side que renderiza a UI de administração do RBAC.
 * É envolvido pelo protetor de página server-side.
 */
export default function RbacAdminClientShell() {
  return (
    <RbacAdminShell
      config={{
        // A baseUrl é omitida pois as chamadas são para a própria aplicação Next.js
        baseUrl: "",
        endpoints: {
          // Endpoints da API para o cliente admin consumir
          permissions: (id: string | number) => `/api/permissoes?perfil=${id}`,
          toggle: "/api/permissoes/toggle",
          profiles: "/api/perfis",
          createProfile: "/api/perfis",
          createPermission: "/api/permissoes",
          users: "/api/usuarios",
          patchUser: (id: string) => `/api/usuarios/${id}`,
        },
      }}
    />
  )
}
