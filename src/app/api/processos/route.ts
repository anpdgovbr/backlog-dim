import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ProcessoInput, ProcessoOutput } from '@/types/Processo'

export async function POST(req: Request) {
  const data: ProcessoInput = await req.json()
  const { data: processo, error } = await supabase
    .from('processos')
    .insert([data])
    .select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(processo as ProcessoOutput[])
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from('processos')
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
    .eq('id', params.id)
    .single() // Garante que retorna um único objeto

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const processos = Array.isArray(data) ? data : [data]

  // Formata os relacionamentos para garantir que sejam objetos únicos
  const formattedData = processos.map((processo) => ({
    ...processo,
    formaEntrada: Array.isArray(processo.formaEntrada)
      ? processo.formaEntrada[0]
      : processo.formaEntrada,
    responsavel: Array.isArray(processo.responsavel)
      ? processo.responsavel[0]
      : processo.responsavel,
    requerido: Array.isArray(processo.requerido)
      ? processo.requerido[0]
      : processo.requerido,
    situacao: Array.isArray(processo.situacao)
      ? processo.situacao[0]
      : processo.situacao,
    encaminhamento: Array.isArray(processo.encaminhamento)
      ? processo.encaminhamento[0]
      : processo.encaminhamento,
    pedidoManifestacao: Array.isArray(processo.pedidoManifestacao)
      ? processo.pedidoManifestacao[0]
      : processo.pedidoManifestacao,
    contatoPrevio: Array.isArray(processo.contatoPrevio)
      ? processo.contatoPrevio[0]
      : processo.contatoPrevio,
    evidencia: Array.isArray(processo.evidencia)
      ? processo.evidencia[0]
      : processo.evidencia
  }))

  return NextResponse.json(formattedData as ProcessoOutput[])
}
