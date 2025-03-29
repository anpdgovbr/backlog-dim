"use client"

import BugReportIcon from "@mui/icons-material/BugReport"
import CloseIcon from "@mui/icons-material/Close"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"

interface DevRoutes {
  pages: string[]
  apis: string[]
}

const FloatingDevMenu = () => {
  const [open, setOpen] = useState(false)
  const [routes, setRoutes] = useState<DevRoutes>({ pages: [], apis: [] })
  const [expanded, setExpanded] = useState<string | false>(false)
  const [expandedApi, setExpandedApi] = useState<boolean>(false)
  const boxRef = useRef<HTMLDivElement>(null)

  // Fetch dev routes
  useEffect(() => {
    fetch("/dev-routes.json")
      .then((res) => res.json())
      .then((data) => setRoutes(data))
      .catch((err) => console.error("Erro ao buscar rotas:", err))
  }, [])

  // Drag logic
  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    // Recupera posição salva
    const savedPosition = localStorage.getItem("devMenuPosition")
    if (savedPosition) {
      const { top, left } = JSON.parse(savedPosition)
      box.style.top = `${top}px`
      box.style.left = `${left}px`
    }

    let offsetX = 0
    let offsetY = 0
    let isDragging = false

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      offsetX = e.clientX - box.offsetLeft
      offsetY = e.clientY - box.offsetTop
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newLeft = e.clientX - offsetX
        const newTop = e.clientY - offsetY
        box.style.left = `${newLeft}px`
        box.style.top = `${newTop}px`
      }
    }

    const handleMouseUp = () => {
      isDragging = false
      // Salva a posição ao soltar
      localStorage.setItem(
        "devMenuPosition",
        JSON.stringify({ top: box.offsetTop, left: box.offsetLeft })
      )
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    const header = box.querySelector(".drag-header")
    header?.addEventListener("mousedown", handleMouseDown as EventListener)

    return () => {
      header?.removeEventListener("mousedown", handleMouseDown as EventListener)
    }
  }, [open])

  const toggleAccordion =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const groupRoutes = (routes: string[]) => {
    const groups: Record<string, string[]> = {}
    routes.forEach((route) => {
      const parts = route.split("/").filter(Boolean)
      if (parts.length > 1) {
        const group = parts[0]
        if (!groups[group]) groups[group] = []
        groups[group].push(route)
      } else {
        if (!groups["root"]) groups["root"] = []
        groups["root"].push(route)
      }
    })
    return groups
  }

  const groupedPages = groupRoutes(routes.pages)

  return (
    <>
      <Fab
        color="primary"
        size="medium"
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 2000,
        }}
      >
        <BugReportIcon />
      </Fab>

      {open && (
        <Paper
          ref={boxRef}
          sx={{
            position: "fixed",
            top: 100,
            left: 100,
            width: 300,
            maxHeight: "80vh",
            overflowY: "auto",
            zIndex: 1999,
            boxShadow: 6,
          }}
        >
          <Box
            className="drag-header"
            sx={{
              cursor: "move",
              backgroundColor: "#1976d2",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>📌 Dev Menu</Typography>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 1 }}>
            {Object.entries(groupedPages).map(([group, pages]) => (
              <Accordion
                key={group}
                expanded={expanded === group}
                onChange={toggleAccordion(group)}
                sx={{ boxShadow: "none" }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 32 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                    {group}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <List dense disablePadding>
                    <ListItem sx={{ padding: "4px 8px" }}>
                      <Link href={`/${group}`} passHref>
                        <ListItemText
                          primary={`/${group}`}
                          sx={{ fontSize: 12, fontWeight: "bold" }}
                        />
                      </Link>
                    </ListItem>
                    {pages
                      .filter((route) => !route.includes("["))
                      .map((route) => (
                        <ListItem key={route} sx={{ padding: "4px 8px" }}>
                          <Link href={route.replace("/page", "")} passHref>
                            <ListItemText primary={route} sx={{ fontSize: 12 }} />
                          </Link>
                        </ListItem>
                      ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}

            <Accordion
              expanded={expandedApi}
              onChange={() => setExpandedApi(!expandedApi)}
              sx={{ boxShadow: "none", mt: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 32 }}>
                <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>APIs</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense disablePadding>
                  {routes.apis.map((route) => (
                    <ListItem key={route} sx={{ padding: "4px 8px", opacity: 0.6 }}>
                      <ListItemText primary={route} sx={{ fontSize: 12 }} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Paper>
      )}
    </>
  )
}

export default FloatingDevMenu
