/**
 * Rota de API para leitura do arquivo de rotas de desenvolvimento.
 *
 * Esta rota expõe o conteúdo do arquivo `dev-routes.json` presente na pasta `public`,
 * permitindo que ferramentas e desenvolvedores obtenham a lista de rotas geradas
 * durante o desenvolvimento do projeto.
 *
 * @remarks
 * - Utiliza o App Router do Next.js.
 * - Retorna o conteúdo do arquivo como JSON.
 * - Em caso de erro ou ausência do arquivo, retorna status apropriado.
 */

/**
 * Manipulador para requisições GET na rota de dev-routes.
 *
 * @returns {Promise<NextResponse>} Retorna o conteúdo do arquivo `dev-routes.json` como resposta JSON,
 * ou mensagem de erro caso o arquivo não exista ou ocorra falha interna.
 */
import fs from "fs"
import path from "path"

import { NextResponse } from "next/server"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "dev-routes.json")

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Arquivo de rotas não encontrado", { status: 404 })
    }

    const data = fs.readFileSync(filePath, "utf-8")
    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Erro na API dev-routes:", error)
    return new NextResponse("Erro interno no servidor", { status: 500 })
  }
}
