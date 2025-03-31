"use client"

import { ChevronLeft, ChevronRight } from "@mui/icons-material"
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List as MUIList,
  Tooltip,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"

export type LinkItem = {
  href: string
  text: string
  icon: React.ReactNode
}

type SideMenuProps = {
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
}: SideMenuProps) {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    setDrawerOpen(saved === null ? true : saved === "true")
    setLoaded(true)
  }, [storageKey])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(storageKey, String(drawerOpen))
    }
  }, [drawerOpen, loaded, storageKey])

  return (
    <Drawer
      variant="permanent"
      open={drawerOpen}
      slotProps={{
        paper: {
          sx: {
            position: "relative",
            width: drawerOpen ? 240 : 72,
            bgcolor: "background.paper",
            borderRight: 1,
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
        px={2}
        py={1}
      >
        {drawerOpen && <Typography variant="subtitle1">{title}</Typography>}
        <IconButton onClick={() => setDrawerOpen((prev) => !prev)} size="small">
          {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <Divider />

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
