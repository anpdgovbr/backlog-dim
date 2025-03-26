"use client"

import { ChevronRight, Home } from "@mui/icons-material"
import { Box, Breadcrumbs, Link as MUILink, Typography } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface GovBrBreadcrumbProps {
  basePath?: string // opcional: para cortar parte inicial da rota
}

type CrumbItem = {
  label: string
  href: string
  icon?: React.ReactNode
}
export default function GovBrBreadcrumb({ basePath = "/admin" }: GovBrBreadcrumbProps) {
  const pathname = usePathname()

  const pathWithoutBase = pathname.replace(basePath, "")
  const segments = pathWithoutBase.split("/").filter(Boolean)

  const breadcrumbs: CrumbItem[] = [
    {
      label: "Início",
      href: basePath,
      icon: <Home fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />,
    },
    ...segments.map((seg, index) => {
      const href = `${basePath}/${segments.slice(0, index + 1).join("/")}`
      return { label: formatSegment(seg), href }
    }),
  ]

  const lastIndex = breadcrumbs.length - 1

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Breadcrumbs separator={<ChevronRight fontSize="small" />} aria-label="breadcrumb">
        {breadcrumbs.map((crumb, index) =>
          index === lastIndex ? (
            <Typography
              key={crumb.href}
              color="text.primary"
              fontWeight="medium"
              sx={{ textTransform: "capitalize" }}
            >
              {crumb.label}
            </Typography>
          ) : (
            <MUILink
              key={crumb.href}
              component={Link}
              href={crumb.href}
              underline="hover"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", textTransform: "capitalize" }}
            >
              {crumb.icon && crumb.icon}
              {crumb.label}
            </MUILink>
          )
        )}
      </Breadcrumbs>
    </Box>
  )
}

function formatSegment(segment: string): string {
  return segment.replace(/-/g, " ")
}
