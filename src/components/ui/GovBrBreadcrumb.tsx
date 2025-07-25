"use client"

import { usePathname } from "next/navigation"

import ChevronRight from "@mui/icons-material/ChevronRight"
import Home from "@mui/icons-material/Home"
import Box from "@mui/material/Box"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

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
            <Link
              key={crumb.href}
              component={Link}
              href={crumb.href}
              underline="hover"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", textTransform: "capitalize" }}
            >
              {crumb.icon && crumb.icon}
              {crumb.label}
            </Link>
          )
        )}
      </Breadcrumbs>
    </Box>
  )
}

function formatSegment(segment: string): string {
  return segment.replace(/-/g, " ")
}
