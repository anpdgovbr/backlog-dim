/**
 * Funções utilitárias de autenticação para uso no servidor.
 *
 * Esse módulo encapsula a chamada a `getServerSession` do next-auth usando
 * as opções definidas em `src/config/next-auth.config`.
 *
 * Uso típico: chamar `auth()` em handlers/rotas do servidor (Server Actions / API)
 * para obter a sessão do usuário autenticado, quando disponível.
 */
import { getServerSession } from "next-auth/next"
import authOptions from "@/config/next-auth.config"

/**
 * Obtém a sessão do servidor usando as opções de autenticação configuradas.
 *
 * Esta função executa `getServerSession(authOptions)` e retorna o objeto de sessão
 * do next-auth ou `null` caso não exista sessão ativa.
 *
 * Observações:
 * - Deve ser usado em contexto de servidor (Server Components / API routes).
 * - Não realiza throw; simplesmente repassa o valor retornado por next-auth.
 *
 * @returns {Promise<import("next-auth").Session | null>} A sessão do usuário ou null se não autenticado.
 */
export async function auth() {
  const session = await getServerSession(authOptions)
  return session
}

export default auth
