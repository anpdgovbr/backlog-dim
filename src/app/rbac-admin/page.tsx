import { redirect } from "next/navigation"
import { protectPage } from "@anpdgovbr/rbac-next"
import { getIdentity, rbacProvider } from "@/lib/rbac/server"
import ClientShell from "./ClientShell"

/**
 * Protege a página de administração do RBAC.
 * A verificação de permissão é feita no servidor antes da renderização.
 * Em caso de falha, o usuário é redirecionado.
 */
export default protectPage(
  ClientShell,
  {
    getIdentity,
    provider: rbacProvider,
    // Permissão necessária para acessar esta página
    permissao: { acao: "Exibir", recurso: "Permissoes" },
  },
  {
    // A função de redirect do Next.js é passada para o helper
    redirectFn: redirect,
    // Opcional: customizar os destinos do redirect
    // redirects: { unauth: '/login', forbidden: '/acesso-negado' }
  }
)
