import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// 🔹 Buscar um processo específico
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

// 🔹 Atualizar um processo específico
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params
  const data = await req.json()

  const { error } = await supabase.from('Processo').update(data).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Processo atualizado com sucesso' })
}

// 🔹 Deletar um processo específico
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params

  const { error } = await supabase.from('Processo').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Processo deletado com sucesso' })
}
