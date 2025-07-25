import type { JSX } from "react"

import Box from "@mui/material/Box"

export function renderJsonColor(json: unknown): JSX.Element {
  if (typeof json === "string")
    return <span style={{ color: "#a31515" }}>&quot;{json}&quot;</span>

  if (typeof json === "number") return <span style={{ color: "#098658" }}>{json}</span>

  if (typeof json === "boolean")
    return <span style={{ color: "#0000ff" }}>{String(json)}</span>

  if (json === null) return <span style={{ color: "#008080" }}>null</span>

  if (Array.isArray(json)) {
    return (
      <span>
        [<br />
        <Box pl={2}>
          {json.map((v, i) => (
            <div key={i}>
              {renderJsonColor(v)}
              {i < json.length - 1 ? "," : ""}
            </div>
          ))}
        </Box>
        ]
      </span>
    )
  }

  if (typeof json === "object" && json !== null) {
    const entries = Object.entries(json as Record<string, unknown>)
    return (
      <span>
        {"{"}
        <br />
        <Box pl={2}>
          {entries.map(([k, v], i) => (
            <div key={k}>
              <span style={{ color: "#000080" }}>&quot;{k}&quot;</span>:{" "}
              {renderJsonColor(v)}
              {i < entries.length - 1 ? "," : ""}
            </div>
          ))}
        </Box>
        {"}"}
      </span>
    )
  }

  return <span>{String(json)}</span>
}
