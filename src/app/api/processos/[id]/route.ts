import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json()
  const { error } = await supabase
    .from('processos')
    .update(data)
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Processo atualizado' })
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from('processos')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Processo deletado' })
}
