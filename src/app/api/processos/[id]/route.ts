import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 🔹 Buscar um processo específico
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params

  const { data, error } = await supabase
    .from('Processo')
    .select(
      `
      id, numero, dataCriacao, requerente,
      formaEntrada:formaEntrada ( id, nome ),
      responsavel:responsavel ( id, nome ),
      requerido:requerido ( id, nome, cnpj, cnae, site, email, setor:setor ( id, nome ) ),
      situacao:situacao ( id, nome ),
      encaminhamento:encaminhamento ( id, nome ),
      pedidoManifestacao:pedidoManifestacao ( id, nome ),
      contatoPrevio:contatoPrevio ( id, nome ),
      evidencia:evidencia ( id, nome )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 🔹 Atualizar um processo específico
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params
  const data = await request.json()

  const { error } = await supabase.from('Processo').update(data).eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Processo atualizado com sucesso' })
}

// 🔹 Deletar um processo específico
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params

  const { error } = await supabase.from('Processo').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Processo deletado com sucesso' })
}
