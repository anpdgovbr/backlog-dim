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
