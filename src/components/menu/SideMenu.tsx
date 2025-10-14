"use client"

import { SideMenu as SharedSideMenu, type SideMenuItem } from "@anpdgovbr/shared-ui"
import Link from "next/link"
import type { ReactNode } from "react"

export type LinkItem = {
  href: string
  text: string
  icon: ReactNode
}

export type SideMenuProps = {
  links: LinkItem[]
  pathname: string
  storageKey?: string
  title?: string
}

const DEFAULT_WIDTH = 200
const DEFAULT_COLLAPSED_WIDTH = 60

const getDefaultOpenState = () => {
  if (typeof window === "undefined") {
    return true
  }

  return !window.matchMedia("(max-width: 960px)").matches
}

export default function SideMenu({
  links,
  pathname,
  storageKey = "drawerOpen",
  title = "Menu",
}: Readonly<SideMenuProps>) {
  const items: SideMenuItem[] = links.map(({ href, text, icon }) => ({
    href,
    label: text,
    icon,
  }))

  return (
    <SharedSideMenu
      title={title}
      items={items}
      width={DEFAULT_WIDTH}
      collapsedWidth={DEFAULT_COLLAPSED_WIDTH}
      defaultOpen={getDefaultOpenState()}
      persistKey={storageKey}
      currentPath={pathname}
      linkComponent={Link}
    />
  )
}
