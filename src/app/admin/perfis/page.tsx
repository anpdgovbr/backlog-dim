"use client"

import { Perfil } from "@/types/Perfil"
import { User } from "@/types/User"
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function GerenciarPerfis() {
  const { data: session, status } = useSession()
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [responsaveis, setResponsaveis] = useState<User[]>([])
  const [perfilUsuario, setPerfilUsuario] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingPerfil, setLoadingPerfil] = useState<boolean>(true)
  const loadingSession = status === "loading"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuariosRes, perfisRes, responsaveisRes] = await Promise.all([
          fetch("/api/usuarios").then((res) => res.json()),
          fetch("/api/perfis").then((res) => res.json()),
          fetch("/api/responsaveis").then((res) => res.json()),
        ])
        setUsuarios(usuariosRes)
        setPerfis(perfisRes)
        setResponsaveis(responsaveisRes)
      } catch (err) {
        console.error("Erro ao buscar dados:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/perfil?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setPerfilUsuario(data)
          setLoadingPerfil(false)
        })
        .catch((err) => {
          console.error("Erro ao buscar perfil do usuário autenticado:", err)
          setLoadingPerfil(false)
        })
    }
  }, [session?.user?.email])

  const usuarioPerfilId = perfilUsuario?.id || null

  const temPermissaoAcesso = usuarioPerfilId === 5 || usuarioPerfilId === 4

  if (loadingSession || loadingPerfil) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (!temPermissaoAcesso) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 3 }}>
          Você não tem permissão para acessar esta página.
        </Alert>
      </Container>
    )
  }

  const handlePerfilChange = async (userId: string, perfilId: number) => {
    try {
      const response = await fetch(`/api/usuarios/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfilId }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil")
      }

      setUsuarios((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, perfilId } : user))
      )
    } catch (error) {
      console.error("Erro ao atualizar perfil do usuário:", error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ m: 0, p: 0 }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
        }}
      >
        <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
          Gerenciar Perfis
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table className="table">
              <TableHead className="th">
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell sx={{ color: "black", fontWeight: "bold" }}>Nome</TableCell>
                  <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                    E-mail
                  </TableCell>
                  <TableCell
                    sx={{ color: "black", fontWeight: "bold", textAlign: "center" }}
                  >
                    Perfil
                  </TableCell>
                  <TableCell
                    sx={{ color: "black", fontWeight: "bold", textAlign: "center" }}
                  >
                    Responsável
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="center">
                      <FormControl fullWidth size="small">
                        <InputLabel id={`perfil-label-${user.id}`}>Perfil</InputLabel>
                        <Select
                          label="Perfil"
                          className="input"
                          value={user.perfilId || ""}
                          onChange={(e) =>
                            handlePerfilChange(user.id, Number(e.target.value))
                          }
                        >
                          <MenuItem className="br-item" value="">
                            Selecione um perfil
                          </MenuItem>
                          {perfis.map((perfil) => (
                            <MenuItem
                              className="br-item"
                              key={perfil.id}
                              value={perfil.id}
                            >
                              {perfil.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell align="center">
                      <FormControl fullWidth size="small">
                        <InputLabel id={`responsavel-label-${user.id}`}>
                          Perfil
                        </InputLabel>
                        <Select
                          label="Responsável"
                          className="input"
                          value={user.responsavelId || ""}
                          onChange={(e) =>
                            handlePerfilChange(user.id, Number(e.target.value))
                          }
                        >
                          <MenuItem className="br-item" value="">
                            Relacione com um responsável
                          </MenuItem>
                          {responsaveis.map((responsavel) => (
                            <MenuItem
                              className="br-item"
                              key={responsavel.id}
                              value={responsavel.id}
                            >
                              {responsavel.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  )
}
