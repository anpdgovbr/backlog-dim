"use client"

import { useEffect, useState } from "react"

/**
 * Interface dos dados de build do version.json
 */
interface BuildData {
  version: string
  buildTime: string
  commitShort: string
}

/**
 * Formata uma data ISO para dd/MM/YYYY HH:mm:ss
 */
function formatBuildDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  } catch {
    return ""
  }
}

/**
 * Componente que exibe informações de build: versão, commit hash e data/hora
 *
 * Formato: v0.4.26 (4f3ebfc) - 13/10/2025 19:13:16
 */
export default function BuildInfo() {
  const [buildInfo, setBuildInfo] = useState<string>("")

  useEffect(() => {
    // Busca version.json no cliente
    fetch("/version.json")
      .then((res) => res.json() as Promise<BuildData>)
      .then((data) => {
        const formattedDate = formatBuildDate(data.buildTime)
        const info = `v${data.version} (${data.commitShort}) - ${formattedDate}`
        setBuildInfo(info)
      })
      .catch(() => {
        // Fallback silencioso: apenas não mostra nada
        setBuildInfo("")
      })
  }, [])

  if (!buildInfo) {
    return null
  }

  return <>{buildInfo}</>
}
