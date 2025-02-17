'use client'
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined
} from '@mui/icons-material'
import Image from 'next/image'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    BRSignIn?: { activate?: () => void }
  }
}

interface GovBRAvatarProps {
  userName: string
  userImage?: string
  menuItems?: { label: string; href?: string }[]
}

export default function GovBRAvatar({
  userName,
  userImage,
  menuItems = [
    { label: 'Dados pessoais', href: '/perfil' },
    { label: 'Privacidade', href: '/privacidade' },
    { label: 'Notificações', href: '/notificacoes' },
    { label: 'Perguntas frequentes', href: '/faq' },
    { label: 'Sair', href: '/logout' }
  ]
}: Readonly<GovBRAvatarProps>) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.BRSignIn?.activate) {
      window.BRSignIn.activate()
    }
  }, [])

  return (
    <div>
      {/* Botão do Avatar */}
      <button
        style={{ height: '56px' }}
        className="br-sign-in"
        type="button"
        id="avatar-dropdown-trigger"
        data-toggle="dropdown"
        data-target="avatar-menu"
        aria-label={`Olá, ${userName}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {userImage ? (
          <span className="br-avatar">
            <Image
              src={userImage}
              alt={userName}
              width={40}
              height={40}
              className="br-avatar-img"
              style={{ '--sign-in-img': '40px' } as React.CSSProperties}
            />
          </span>
        ) : (
          <span className="br-avatar" title={userName}>
            <span className="content bg-orange-vivid-30 text-pure-0">
              {userName.charAt(0).toUpperCase()}
            </span>
          </span>
        )}
        <span className="ml-2 text-gray-80 text-weight-regular">
          Olá, <span className="text-weight-semi-bold">{userName}</span>
        </span>
        {menuOpen ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
      </button>

      <div
        className="br-list"
        id="avatar-menu"
        data-toggle="dropdown"
        hidden={!menuOpen || undefined}
        role="menu"
        aria-labelledby="avatar-dropdown-trigger"
      >
        {menuItems.map((item) => (
          <a
            key={item.label}
            className="br-item"
            href={item.href ?? 'javascript:void(0)'}
            role="menuitem"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}
