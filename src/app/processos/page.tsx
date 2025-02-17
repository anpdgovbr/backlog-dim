'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ProcessoOutput } from '@/types/Processo'

export default function ProcessosPage() {
  const [processos, setProcessos] = useState<ProcessoOutput[]>([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('processos').select(`
          id, numero, dataCriacao, requerente,
          formaEntrada:formaEntrada ( id, nome ),
          responsavel:responsavel ( id, nome ),
          situacao:situacao ( id, nome ),
          encaminhamento:encaminhamento ( id, nome )
        `)

      if (!error) {
        const formattedData = Array.isArray(data)
          ? data.map((processo) => ({
              ...processo,
              formaEntrada: processo.formaEntrada?.[0] || null,
              responsavel: processo.responsavel?.[0] || null,
              situacao: processo.situacao?.[0] || null,
              encaminhamento: processo.encaminhamento?.[0] || null
            }))
          : []

        setProcessos(formattedData)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1>Lista de Processos</h1>
      <a href="/processos/new" className="btn btn-primary">
        Novo Processo
      </a>
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Data de Criação</th>
            <th>Requerente</th>
            <th>Responsável</th>
            <th>Forma de Entrada</th>
            <th>Situação</th>
            <th>Encaminhamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {processos.map((p) => (
            <tr key={p.id}>
              <td>{p.numero}</td>
              <td>{new Date(p.dataCriacao).toLocaleDateString()}</td>
              <td>{p.requerente ?? 'Anônimo'}</td>
              <td>{p.responsavel?.nome || 'Não atribuído'}</td>
              <td>{p.formaEntrada?.nome || 'Desconhecida'}</td>
              <td>{p.situacao?.nome || 'Indefinida'}</td>
              <td>{p.encaminhamento?.nome || 'Não definido'}</td>
              <td>
                <a href={`/processos/edit/${p.id}`} className="btn btn-warning">
                  Editar
                </a>
                <a
                  href={`/processos/delete/${p.id}`}
                  className="btn btn-danger"
                >
                  Deletar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
