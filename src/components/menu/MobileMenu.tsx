"use client"

import MenuIcon from "@mui/icons-material/Menu"
import {
  AppBar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useState } from "react"

import type { LinkItem } from "./SideMenu"

type MobileMenuProps = {
  links: LinkItem[]
  pathname: string
  title?: string
  onMenuOpenChange?: (open: boolean) => void
}

export default function MobileMenu({
  links,
  pathname,
  title = "Menu",
  onMenuOpenChange,
}: MobileMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    onMenuOpenChange?.(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
    onMenuOpenChange?.(false)
  }

  return (
    <>
      <AppBar position="static" color="default" sx={{ mb: 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            onClick={handleOpen}
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
        {links.map(({ href, text, icon }) => (
          <MenuItem
            key={href}
            component={Link}
            href={href}
            selected={pathname === href || pathname.startsWith(href)}
            onClick={handleClose}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            {text}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
