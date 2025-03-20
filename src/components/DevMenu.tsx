"use client"

import { ExpandLess, ExpandMore } from "@mui/icons-material"
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DevMenu() {
  const [routes, setRoutes] = useState<string[]>([])
  const [apiRoutes, setApiRoutes] = useState<string[]>([])
  const [openApi, setOpenApi] = useState(false)
  const [openPages, setOpenPages] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch("/api/dev-routes")
        .then((res) => res.json())
        .then((data) => {
          setRoutes(data.pages || [])
          setApiRoutes(data.apis || [])
        })
        .catch((err) => console.error("Erro ao buscar rotas:", err))
    }
  }, [])

  return (
    <Box
      sx={{
        width: "250px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#1a202c",
        color: "white",
        padding: 2,
        overflowY: "auto",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
        Menu de Rotas
      </Typography>

      <Divider />

      {/* Páginas */}
      <List>
        <ListItemButton onClick={() => setOpenPages(!openPages)}>
          <ListItemText primary="📂 Páginas" />
          {openPages ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openPages} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {routes.map((route) => (
              <ListItemButton key={route} component={Link} href={route} sx={{ pl: 3 }}>
                <ListItemText primary={route} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>

      <Divider />

      {/* APIs */}
      <List>
        <ListItemButton onClick={() => setOpenApi(!openApi)}>
          <ListItemText primary="🔗 APIs" />
          {openApi ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openApi} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {apiRoutes.map((route) => (
              <ListItemButton key={route} component={Link} href={route} sx={{ pl: 3 }}>
                <ListItemText primary={route} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  )
}
