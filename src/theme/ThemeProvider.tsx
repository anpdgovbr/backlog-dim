"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"

import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"

import ANPDtheme from "./theme"

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div> // 🔥 Evita erro de Hydration Failed
  }

  return (
    <MuiThemeProvider theme={ANPDtheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
