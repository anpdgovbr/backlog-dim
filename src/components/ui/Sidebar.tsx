"use client"

import { useState } from "react"

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import MenuIcon from "@mui/icons-material/Menu"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

interface SidebarProps {
  title?: string
  items: SidebarItem[]
  defaultOpen?: boolean
  width?: number
}

export default function Sidebar({
  title = "Menu",
  items,
  defaultOpen = false,
  width = 280,
}: SidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [open, setOpen] = useState(!isMobile && defaultOpen)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const drawerContent = (
    <Box
      sx={{
        width: width,
        height: "100%",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elementos decorativos */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.03)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.05)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "primary.contrastText",
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={toggleDrawer}
          sx={{
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Lista de itens */}
      <List sx={{ position: "relative", zIndex: 1, mt: 1 }}>
        {items.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={item.onClick}
              disabled={item.disabled}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                },
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "primary.contrastText",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      {/* Botão para abrir o menu em mobile */}
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1200,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={() => isMobile && setOpen(false)}
        ModalProps={{
          keepMounted: true, // Melhor performance em mobile
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: width,
            border: "none",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}
