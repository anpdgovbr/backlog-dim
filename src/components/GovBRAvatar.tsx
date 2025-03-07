"use client"

import { KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from "@mui/icons-material"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    BRSignIn?: { activate?: () => void }
  }
}

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
    { label: "Dados pessoais", href: "/dashboard/perfil" },
    { label: "Sair", href: "/auth/logout" }
  ]

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        style={{ height: "56px" }}
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
        <span className="ml-2 text-gray-80 text-weight-regular">
          Olá,{" "}
          <span className="text-weight-semi-bold">
            {session?.user?.name || "Usuário"}
          </span>
        </span>
        {menuOpen ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
      </button>

      <div
        className="br-list"
        hidden={!menuOpen}
        style={{
          position: "absolute",
          right: 0,
          top: "100%",
          zIndex: 1000,
          width: "240px",
          marginTop: "8px"
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="br-item"
            role="menuitem"
            onClick={() => handleNavigation(item.href!)}
            style={{
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start"
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
