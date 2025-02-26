'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <p>Carregando...</p> // Evita erro de Hydration Failed
  }

  if (status === 'loading') {
    return <p>Carregando sessão...</p>
  }

  if (!session) {
    return (
      <div>
        <p>Você precisa estar logado.</p>
        <button onClick={() => signIn('azure-ad')}>Entrar com Entra ID</button>
      </div>
    )
  }

  return (
    <div>
      <p>Bem-vindo, {session.user?.name}!</p>
      <button onClick={() => signOut()}>Sair</button>
    </div>
  )
}
