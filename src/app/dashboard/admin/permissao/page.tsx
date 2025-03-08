"use client"

import { Perfil } from "@/types/Perfil"
import { Permissao } from "@/types/Permissao"
import { useEffect, useState } from "react"

export default function GerenciarPermissoes() {
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [permissoes, setPermissoes] = useState<Permissao[]>([])
  const [perfilSelecionado, setPerfilSelecionado] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetch("/api/perfis")
      .then((res) => res.json())
      .then((data: Perfil[]) => setPerfis(data))
  }, [])

  useEffect(() => {
    if (perfilSelecionado !== null) {
      setLoading(true)
      fetch(`/api/permissoes?perfilId=${perfilSelecionado}`)
        .then((res) => res.json())
        .then((data: Permissao[]) => {
          // 🔹 Garante que cada permissão seja única, removendo duplicatas
          const permissoesUnicas = Array.from(
            new Map(
              data.map((p: Permissao) => [
                `${p.acao}_${p.recurso}_${perfilSelecionado}`,
                p
              ])
            ).values()
          )
          setPermissoes(permissoesUnicas)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Erro ao carregar permissões:", err)
          setLoading(false)
        })
    }
  }, [perfilSelecionado])

  const handleTogglePermissao = async (permissao: Permissao) => {
    const novaPermissao = { ...permissao, permitido: !permissao.permitido }

    // 🔹 Atualiza SOMENTE a permissão específica no estado
    setPermissoes((prev) =>
      prev.map((p: Permissao) => (p.id === permissao.id ? novaPermissao : p))
    )

    // 🔹 Atualiza a permissão na API (garante que só afeta o perfil correto)
    await fetch(`/api/permissoes/${permissao.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permitido: novaPermissao.permitido })
    })
  }

  return (
    <div className="container">
      <h2>Gerenciar Permissões</h2>

      <select
        onChange={(e) => setPerfilSelecionado(Number(e.target.value))}
        value={perfilSelecionado || ""}
      >
        <option value="">Selecione um perfil</option>
        {perfis.map((perfil) => (
          <option key={perfil.id} value={perfil.id}>
            {perfil.nome}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Carregando permissões...</p>
      ) : perfilSelecionado !== null && permissoes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ação</th>
              <th>Recurso</th>
              <th>Permitido</th>
            </tr>
          </thead>
          <tbody>
            {permissoes.map((p: Permissao) => (
              <tr key={`${p.acao}_${p.recurso}_${perfilSelecionado}`}>
                <td>{p.acao}</td>
                <td>{p.recurso}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={p.permitido}
                    onChange={() => handleTogglePermissao(p)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Não há permissões disponíveis para este perfil.</p>
      )}
    </div>
  )
}
