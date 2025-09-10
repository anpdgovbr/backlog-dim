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

export type AvatarMenuItem = {
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

export type GovBRAvatarProps = {
  name?: string
  imageUrl?: string | null
  items?: AvatarMenuItem[]
  size?: number
  greetingPrefix?: string
  showGreeting?: boolean
  onNavigate?: (href: string) => void
}

export default function GovBRAvatar({
  name = "Usuário",
  imageUrl = null,
  items = [],
  size = 40,
  greetingPrefix = "Olá",
  showGreeting = true,
  onNavigate,
}: Readonly<GovBRAvatarProps>) {
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
    if (onNavigate) {
      onNavigate(href)
    } else {
      router.push(href)
    }
  }

  const initial = name?.charAt(0)?.toUpperCase() || "U"

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        style={{ height: `${size + 8}px` }}
        className="br-sign-in"
        type="button"
        aria-label={`${greetingPrefix}, ${name}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {imageUrl ? (
          <span className="br-avatar">
            <Image
              src={imageUrl}
              alt={name || "Usuário"}
              width={size}
              height={size}
              className="br-avatar-img"
              style={{ "--sign-in-img": `${size}px` } as React.CSSProperties}
            />
          </span>
        ) : (
          <span className="br-avatar" title={name || "Usuário"}>
            <span className="content bg-orange-vivid-30 text-pure-0">{initial}</span>
          </span>
        )}
        {showGreeting && (
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
            {greetingPrefix},{" "}
            <span className="text-weight-semi-bold">{name || "Usuário"}</span>
          </span>
        )}
        {items.length > 0 &&
          (menuOpen ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />)}
      </button>

      {items.length > 0 && (
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
          {items.map((item) => (
            <button
              key={item.label}
              className="br-item"
              role="menuitem"
              onClick={() => {
                if (item.onClick) item.onClick()
                if (item.href) handleNavigation(item.href)
              }}
              disabled={item.disabled}
              style={{
                width: "100%",
                textAlign: "left",
                justifyContent: "flex-start",
                opacity: item.disabled ? 0.7 : 1,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
