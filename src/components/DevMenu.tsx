"use client"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material"
import Link from "next/link"
import React, { useEffect, useState } from "react"

interface DevRoutes {
  pages: string[]
  apis: string[]
}

const DevMenu = () => {
  const [routes, setRoutes] = useState<DevRoutes>({ pages: [], apis: [] })
  const [expanded, setExpanded] = useState<string | false>(false)
  const [expandedApi, setExpandedApi] = useState<boolean>(false) // Controla o accordion de APIs

  useEffect(() => {
    fetch("/dev-routes.json")
      .then((res) => res.json())
      .then((data) => setRoutes(data))
      .catch((err) => console.error("Erro ao buscar rotas:", err))
  }, [])

  const toggleAccordion =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
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
    <Box
      sx={{
        width: 250,
        bgcolor: "#f5f5f5",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        marginTop: "70px", // Evita sobreposição do header
        overflowY: "auto",
        borderRight: "1px solid #ddd",
        padding: 1,
      }}
    >
      <Typography variant="h6" sx={{ fontSize: 14, fontWeight: "bold", padding: "8px" }}>
        📌 Dev Menu
      </Typography>

      <List dense>
        {Object.entries(groupedPages).map(([group, pages]) => (
          <Accordion
            key={group}
            expanded={expanded === group}
            onChange={toggleAccordion(group)}
            sx={{ boxShadow: "none" }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 32 }}>
              <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                {group.toUpperCase()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <List dense>
                {pages.map((route) => (
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

        {/* Accordion para APIs */}
        <Accordion
          expanded={expandedApi}
          onChange={() => setExpandedApi(!expandedApi)}
          sx={{ boxShadow: "none", marginTop: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 32 }}>
            <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>APIs</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <List dense>
              {routes.apis.map((route) => (
                <ListItem key={route} sx={{ padding: "4px 8px", opacity: 0.6 }}>
                  <ListItemText primary={route} sx={{ fontSize: 12 }} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </List>
    </Box>
  )
}

export default DevMenu
