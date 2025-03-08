"use client"

import { Perfil } from "@/types/Perfil"
import { User } from "@/types/User"
import { useEffect, useState } from "react"

export default function GerenciarPerfis() {
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [perfis, setPerfis] = useState<Perfil[]>([])

  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((data: User[]) => setUsuarios(data))
      .catch((err) => console.error("Erro ao buscar usuários:", err))

    fetch("/api/perfis")
      .then((res) => res.json())
      .then((data: Perfil[]) => setPerfis(data))
      .catch((err) => console.error("Erro ao buscar perfis:", err))
  }, [])

  const handlePerfilChange = async (userId: string, perfilId: number) => {
    await fetch(`/api/usuarios/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ perfilId }),
    })

    // Atualiza a lista após alteração
    setUsuarios((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, perfilId } : user))
    )
  }

  return (
    <div>
      <h2>Gerenciar Perfis</h2>
      {usuarios.map((user) => (
        <div key={user.id}>
          <span>{user.email}</span>
          <select
            value={user.perfilId || ""}
            onChange={(e) => handlePerfilChange(user.id, Number(e.target.value))}
          >
            <option value="">Selecione um perfil</option>
            {perfis.map((perfil) => (
              <option key={perfil.id} value={perfil.id}>
                {perfil.nome}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
