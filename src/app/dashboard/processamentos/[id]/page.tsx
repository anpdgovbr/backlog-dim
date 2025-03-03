import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ClientProcessamento from './client-page'

type Params = Promise<{ id: string }>

export default async function DetalhesProcessamento(props: { params: Params }) {
  const params = await props.params
  const id = params.id
  if (!id) {
    return notFound()
  }

  const { data, error } = await supabase
    .from('processamentos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return notFound()
  }

  return <ClientProcessamento data={data} />
}
