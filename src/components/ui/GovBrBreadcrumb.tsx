"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { GovBRBreadcrumb } from "@anpdgovbr/shared-ui"

export interface GovBrBreadcrumbProps {
  basePath?: string // opcional: para cortar parte inicial da rota
}

type BreadcrumbLink = {
  label: string
  url: string
}

function formatSegment(segment: string): string {
  return segment.replace(/-/g, " ")
}

/**
 * Wrapper do GovBRBreadcrumb do shared-ui que gera automaticamente
 * os links baseado na rota atual e um basePath.
 *
 * Usa o componente GovBRBreadcrumb em modo MUI (strictgovbr=false)
 * com children gerados dinamicamente.
 */
export default function GovBrBreadcrumb({
  basePath = "/admin",
}: Readonly<GovBrBreadcrumbProps>) {
  const pathname = usePathname()

  const links = useMemo<BreadcrumbLink[]>(() => {
    const pathWithoutBase = pathname.replace(basePath, "")
    const segments = pathWithoutBase.split("/").filter(Boolean)

    const breadcrumbLinks: BreadcrumbLink[] = [
      {
        label: "🏠 Início",
        url: basePath,
      },
    ]

    segments.forEach((seg, index) => {
      const url = `${basePath}/${segments.slice(0, index + 1).join("/")}`
      breadcrumbLinks.push({
        label: formatSegment(seg),
        url,
      })
    })

    return breadcrumbLinks
  }, [pathname, basePath])

  // Usa o modo MUI do GovBRBreadcrumb (strictgovbr=false, que é o padrão)
  // Renderiza como Breadcrumbs do MUI com os links gerados
  return (
    <GovBRBreadcrumb sx={{ mb: 1 }}>
      {links.map((link, index) => {
        const isLast = index === links.length - 1

        if (isLast) {
          return (
            <span
              key={link.url}
              style={{
                textTransform: "capitalize",
                fontWeight: 500,
              }}
            >
              {link.label}
            </span>
          )
        }

        return (
          <a
            key={link.url}
            href={link.url}
            style={{
              textTransform: "capitalize",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {link.label}
          </a>
        )
      })}
    </GovBRBreadcrumb>
  )
}
