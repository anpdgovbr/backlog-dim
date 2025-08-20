"use client"

import dayjs from "dayjs"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid"
import { DataGrid } from "@mui/x-data-grid"

import { dataGridStyles } from "@/styles/dataGridStyles"

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
  { field: "tabela", headerName: "Entidade", width: 120 },
  { field: "acao", headerName: "Ação", width: 100 },
  { field: "email", headerName: "Usuário", width: 200 },
  {
    field: "criadoEm",
    headerName: "Data/Hora",
    width: 160,
    valueFormatter: ({ value }) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
  },
  { field: "contexto", headerName: "Contexto", flex: 1 },
]

export default function AdminLogViewer() {
  const [dados, setDados] = useState<AuditLogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [filtroEmail, setFiltroEmail] = useState("")
  const [filtroTabela, setFiltroTabela] = useState("")
  const [filtroAcao, setFiltroAcao] = useState("")
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "criadoEm", sort: "desc" },
  ])
  const router = useRouter()

  const fetchLogs = async () => {
    const params = new URLSearchParams()

    params.set("page", (paginationModel.page + 1).toString())
    params.set("pageSize", paginationModel.pageSize.toString())

    const sort = sortModel[0]
    if (sort) {
      params.set("orderBy", sort.field)
      params.set("ascending", (sort.sort === "asc").toString())
    }

    if (filtroEmail) params.set("email", filtroEmail)
    if (filtroTabela) params.set("tabela", filtroTabela)
    if (filtroAcao) params.set("acao", filtroAcao)

    const res = await fetch(`/api/auditoria?${params.toString()}`)
    const json = await res.json()

    setDados(json.dados || [])
    setTotal(json.total || 0)
  }

  useEffect(() => {
    fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, sortModel, filtroEmail, filtroTabela, filtroAcao])

  return (
    <Stack spacing={2} p={2}>
      <Typography variant="h4">Auditoria</Typography>
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

      <Box sx={dataGridStyles}>
        <DataGrid
          sx={{
            minHeight: "50vh",
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
          rows={dados}
          columns={colunas}
          onRowClick={(params) => {
            router.push(`/admin/auditoria/${params.row.id}`)
          }}
          getRowId={(row) => row.id}
          rowCount={total}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableRowSelectionOnClick
          density="compact"
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>
    </Stack>
  )
}
