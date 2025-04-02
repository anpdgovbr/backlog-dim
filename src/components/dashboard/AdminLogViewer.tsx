import { dataGridStyles } from "@/styles/dataGridStyles"
import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

interface AuditLogEntry {
  id: number
  tabela: string
  acao: string
  email: string
  criadoEm: string
  contexto: string
  userAgent: string
  ip: string
}

const colunas: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "tabela", headerName: "Tabela", width: 120 },
  { field: "acao", headerName: "Ação", width: 120 },
  { field: "email", headerName: "Usuário", width: 200 },
  {
    field: "criadoEm",
    headerName: "Data/Hora",
    width: 180,
    valueFormatter: ({ value }) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
  },
  { field: "contexto", headerName: "Contexto", flex: 1 },
]

export default function AdminLogViewer() {
  const [dados, setDados] = useState<AuditLogEntry[]>([])
  const [filtroEmail, setFiltroEmail] = useState("")
  const [filtroTabela, setFiltroTabela] = useState("")
  const [filtroAcao, setFiltroAcao] = useState("")

  useEffect(() => {
    const fetchLogs = async () => {
      const params = new URLSearchParams()
      if (filtroEmail) params.append("email", filtroEmail)
      if (filtroTabela) params.append("tabela", filtroTabela)
      if (filtroAcao) params.append("acao", filtroAcao)

      const res = await fetch(`/api/auditoria?${params.toString()}`)
      const json = await res.json()
      setDados(json.dados || [])
    }

    fetchLogs()
  }, [filtroEmail, filtroTabela, filtroAcao])

  return (
    <Stack spacing={2} p={2}>
      <Typography variant="h6">Auditoria</Typography>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Usuário"
          value={filtroEmail}
          onChange={(e) => setFiltroEmail(e.target.value)}
          size="small"
        />
        <TextField
          sx={{ width: 120 }}
          label="Tabela"
          value={filtroTabela}
          onChange={(e) => setFiltroTabela(e.target.value)}
          select
          size="small"
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="processo">processo</MenuItem>
          <MenuItem value="requerido">requerido</MenuItem>
          <MenuItem value="user">user</MenuItem>
          <MenuItem value="permissao">permissao</MenuItem>
        </TextField>
        <TextField
          sx={{ width: 120 }}
          label="Ação"
          value={filtroAcao}
          onChange={(e) => setFiltroAcao(e.target.value)}
          select
          size="small"
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="CREATE">CREATE</MenuItem>
          <MenuItem value="UPDATE">UPDATE</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
        </TextField>
      </Stack>
      <Box sx={{ ...dataGridStyles, height: "100%", width: "100%", display: "flex" }}>
        <DataGrid
          sx={{ minHeight: "45vh" }}
          rows={dados}
          columns={colunas}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          density="compact"
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>
    </Stack>
  )
}
