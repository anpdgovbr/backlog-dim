import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// 🔹 Criar um novo processo
export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log('Recebendo dados:', data)

    const { data: processo, error } = await supabase
      .from('Processo')
      .insert([data])
      .select('*')

    if (error) {
      console.error('Erro ao inserir processo:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Processo criado:', processo)
    return NextResponse.json(processo, { status: 201 }) // HTTP 201 Created
  } catch (err) {
    console.error('Erro geral no POST:', err)
    return NextResponse.json({ error: err }, { status: 500 })
  }
}

// 🔹 Listar todos os processos com paginação e ordenação
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || 10
    const orderBy = searchParams.get('orderBy') || 'dataCriacao'
    const ascending = searchParams.get('ascending') === 'true'

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // 🔹 Buscar total de registros
    const { data: processos, error: countError } = await supabase
      .from('Processo')
      .select('id') // Pegamos os IDs sem count
      .limit(1) // Pegamos apenas um para testar

    if (countError) {
      console.error('Erro ao contar registros:', countError)
      return NextResponse.json(
        {
          error: `Erro ao contar registros: ${countError.message || 'Falha desconhecida'}`
        },
        { status: 500 }
      )
    }

    // Se processos não for null, pegamos a contagem correta
    const count = processos ? processos.length : 0

    // 🔹 Buscar dados paginados
    const { data, error } = await supabase
      .from('Processo')
      .select(
        `
    id, numero, dataCriacao, requerente,
    formaEntrada: "FormaEntrada"!inner ( id, nome ),
    responsavel: "Responsavel"!inner ( id, nome ),
    situacao: "Situacao"!inner ( id, nome ),
    encaminhamento: "Encaminhamento"!inner ( id, nome )
  `
      )
      .order(orderBy, { ascending })
      .range(from, to)

    if (error) throw new Error(`Erro ao buscar processos: ${error.message}`)

    return NextResponse.json({ data, total: count || 0 })
  } catch (err) {
    console.error('Erro na API /api/processos:', err)
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
