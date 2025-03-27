import { mapearUsuariosComResponsaveis } from "@/lib/helpers/mapaUserComResponsavel"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await mapearUsuariosComResponsaveis()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}
