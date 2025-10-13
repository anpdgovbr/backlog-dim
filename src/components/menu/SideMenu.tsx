"use client"

import { useEffect, useState } from "react"

import Link from "next/link"

import ChevronLeft from "@mui/icons-material/ChevronLeft"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import MUIList from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

export type LinkItem = {
  href: string
  text: string
  icon: React.ReactNode
}

export type SideMenuProps = {
  links: LinkItem[]
  pathname: string
  storageKey?: string
  title?: string
}

export default function SideMenu({
  links,
  pathname,
  storageKey = "drawerOpen",
  title = "Menu",
}: Readonly<SideMenuProps>) {
  const [drawerOpen, setDrawerOpen] = useState(() => {
    if (typeof window === "undefined") return true
    // Em telas pequenas, inicia fechado
    if (window.matchMedia("(max-width: 960px)").matches) return false
    const saved = localStorage.getItem(storageKey)
    return saved === null ? true : saved === "true"
  })

  // Persiste estado no localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, String(drawerOpen))
  }, [drawerOpen, storageKey])

  return (
    <Drawer
      variant="permanent"
      open={drawerOpen}
      slotProps={{
        paper: {
          sx: {
            position: "relative",
            width: drawerOpen ? 200 : 60,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            alignSelf: "flex-start",
            overflowX: "hidden",
            transition: "width 0.3s ease",
          },
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent={drawerOpen ? "space-between" : "center"}
        p={1}
      >
        {drawerOpen && (
          <Typography sx={{ mb: 0, pb: 0 }} variant="subtitle1">
            {title}
          </Typography>
        )}
        <IconButton onClick={() => setDrawerOpen((prev) => !prev)} size="small">
          {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <Divider sx={{ m: 0, p: 0 }} />

      <MUIList>
        {links.map(({ href, text, icon }) => (
          <ListItemButton
            key={href}
            component={Link}
            href={href}
            selected={pathname === href || (href !== "/" && pathname.startsWith(href))}
            sx={{ justifyContent: drawerOpen ? "flex-start" : "center", px: 2 }}
          >
            <Tooltip title={!drawerOpen ? text : ""} placement="right" arrow>
              <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 2 : 0 }}>
                {icon}
              </ListItemIcon>
            </Tooltip>
            {drawerOpen && <ListItemText primary={text} />}
          </ListItemButton>
        ))}
      </MUIList>
    </Drawer>
  )
}
