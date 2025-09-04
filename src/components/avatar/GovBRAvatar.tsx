"use client"

/**
 * Componente e utilitários relacionados ao avatar de autenticação Gov.br.
 *
 * Este arquivo contém o componente GovBRAvatar utilizado na barra de navegação
 * para exibir o avatar do usuário (imagem ou iniciais), abrir um menu de ações
 * (ex.: Meu perfil, Sair) e interagir com o script de login gov.br quando disponível.
 *
 * Notas:
 * - Mantém a diretiva "use client" para execução no cliente.
 * - Usa next-auth para sessão e logout, e next/navigation para navegação.
 */

import { useEffect, useRef, useState } from "react"

import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined"
import KeyboardArrowUpOutlined from "@mui/icons-material/KeyboardArrowUpOutlined"
import { GovBRButton } from "@anpdgovbr/shared-ui"

/**
 * Interface para a extensão global carregada pelo script gov.br.
 *
 * A propriedade BRSignIn pode ser injetada externamente e expor um método
 * `activate` utilizado para inicializar comportamentos de autenticação
 * da biblioteca gov.br no escopo da página.
 *
 * Exemplo de uso:
 *   if (window.BRSignIn?.activate) {
 *     window.BRSignIn.activate()
 *   }
 */
declare global {
  interface Window {
    BRSignIn?: { activate?: () => void }
  }
}

/**
 * Componente GovBRAvatar
 *
 * Exibe um botão estilo Gov.BR com o avatar do usuário (imagem ou iniciais),
 * nome reduzido, e um menu com ações (perfil, logout). O componente:
 * - Lê a sessão via next-auth (useSession).
 * - Usa um estado local para controlar a abertura do menu.
 * - Detecta cliques fora do menu para fechá-lo.
 * - Ativa o script gov.br quando presente (window.BRSignIn.activate).
 *
 * Retorno:
 * - JSX.Element contendo o botão e a lista de ações.
 *
 * Observações:
 * - Não altera rotas do servidor; usa signOut para logout com callback.
 */
export default function GovBRAvatar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.BRSignIn?.activate) {
      window.BRSignIn.activate()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNavigation = (href: string) => {
    setMenuOpen(false)
    if (href === "/auth/logout") {
      signOut({ callbackUrl: "/auth/login" })
    } else {
      router.push(href)
    }
  }

  const menuItems = [
    { label: "Meu perfil", href: "/perfil" },
    { label: "Sair", href: "/auth/logout" },
  ]

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <GovBRButton
        style={{ height: "48px" }}
        className="br-sign-in"
        type="button"
        aria-label={`Olá, ${session?.user?.name}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {session?.user?.image ? (
          <span className="br-avatar">
            <Image
              src={session.user.image}
              alt={session.user.name || "Usuário"}
              width={40}
              height={40}
              className="br-avatar-img"
              style={{ "--sign-in-img": "40px" } as React.CSSProperties}
            />
          </span>
        ) : (
          <span className="br-avatar" title={session?.user?.name || ""}>
            <span className="content bg-orange-vivid-30 text-pure-0">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </span>
        )}
        <span
          className="ml-2 text-gray-80 text-weight-regular"
          style={{
            display: "inline-block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "300px",
          }}
        >
          Olá,{" "}
          <span className="text-weight-semi-bold">
            {session?.user?.name || "Usuário"}
          </span>
        </span>
        {menuOpen ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
      </GovBRButton>

      <div
        className="br-list"
        hidden={!menuOpen}
        style={{
          position: "absolute",
          right: 0,
          top: "100%",
          zIndex: 1000,
          width: "240px",
          marginTop: "0px",
        }}
      >
        {menuItems.map((item) => (
          <GovBRButton
            key={item.label}
            className="br-item"
            role="menuitem"
            onClick={() => handleNavigation(item.href!)}
            style={{
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start",
            }}
          >
            {item.label}
          </GovBRButton>
        ))}
      </div>
    </div>
  )
}
