"use client"

import useSWR from "swr"
import { useState } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Typography from "@mui/material/Typography"

import type { PerfilDto } from "@anpdgovbr/shared-types"

import { withPermissao } from "@anpdgovbr/rbac-react"
import { fetcher } from "@/lib/fetcher"

interface Edge {
  parentId: number
  parentNome: string
  childId: number
  childNome: string
}

function HerancaPerfisContent() {
  const { data: perfis } = useSWR<PerfilDto[]>("/api/perfis", fetcher)
  const { data: edges, mutate } = useSWR<Edge[]>("/api/perfis/heranca", fetcher)

  const [parentId, setParentId] = useState<number | "">("")
  const [childId, setChildId] = useState<number | "">("")

  // mapa de perfis removido (não utilizado)

  async function adicionar() {
    if (!parentId || !childId || parentId === childId) return
    await fetch("/api/perfis/heranca", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentId, childId }),
    })
    setParentId("")
    setChildId("")
    mutate()
  }

  async function remover(pId: number, cId: number) {
    const qs = new URLSearchParams({ parentId: String(pId), childId: String(cId) })
    await fetch(`/api/perfis/heranca?${qs.toString()}`, { method: "DELETE" })
    mutate()
  }

  return (
    <Box p={2}>
      <Typography variant="h4" fontWeight="medium" sx={{ mb: 2 }}>
        Herança de Perfis
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "1 1 260px", minWidth: 240 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="parent-select">Pai</InputLabel>
                <Select
                  labelId="parent-select"
                  value={parentId}
                  label="Pai"
                  onChange={(e) => setParentId(Number(e.target.value) || "")}
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {perfis?.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: "1 1 260px", minWidth: 240 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="child-select">Filho</InputLabel>
                <Select
                  labelId="child-select"
                  value={childId}
                  label="Filho"
                  onChange={(e) => setChildId(Number(e.target.value) || "")}
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {perfis?.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{ width: { xs: "100%", md: 140 }, display: "flex", alignItems: "end" }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={adicionar}
                sx={{ height: 40 }}
              >
                Adicionar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Relações
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {edges?.length ? (
          edges.map((e) => (
            <Box
              key={`${e.parentId}-${e.childId}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "background.paper",
                px: 2,
                py: 1,
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <Typography>
                {e.parentNome} → {e.childNome}
              </Typography>
              <Button
                color="error"
                variant="outlined"
                onClick={() => remover(e.parentId, e.childId)}
              >
                Remover
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="body2">Nenhuma relação cadastrada.</Typography>
        )}
      </Box>
    </Box>
  )
}

export default withPermissao(HerancaPerfisContent, "Alterar", "Permissoes")
