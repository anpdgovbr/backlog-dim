"use client"

import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material"
import { ReactNode, useEffect, useState } from "react"

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
