"use client"

import { CNAE } from "@/types/CNAE"
import { EnumData } from "@/types/EnumData"
import { RequeridoInput, RequeridoOutput } from "@/types/Requerido"
import { validateEmail, validateSite } from "@/utils/formUtils"
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"
import MaskedInput from "react-text-mask"

export default function RequeridoForm({
  requeridoId,
  onSave,
}: {
  requeridoId: number | null
  onSave?: () => void
}) {
  const [requerido, setRequerido] = useState<RequeridoOutput | null>(
    requeridoId
      ? null
      : {
          id: 0,
          nome: "",
          cnpj: "",
          site: "",
          email: "",
          cnae: undefined,
          setor: undefined,
        }
  )
  const [loadingCNAE, setLoadingCNAE] = useState(false)
  const [cnaeSearch, setCnaeSearch] = useState("") // 🔹 Estado para pesquisa de CNAE

  const [emailError, setEmailError] = useState<string | undefined>(undefined)
  const [siteError, setSiteError] = useState<string | undefined>(undefined)

  const [listas, setListas] = useState<{
    cnaes: CNAE[]
    setores: EnumData[]
  }>({
    cnaes: [],
    setores: [],
  })

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchRequerido() {
      try {
        if (!requeridoId) {
          setRequerido({
            id: 0,
            nome: "",
            cnpj: "",
            site: "",
            email: "",
            cnae: undefined,
            setor: undefined,
          })
          return
        }

        const response = await fetch(`/api/requeridos/${requeridoId}`, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} - ${await response.text()}`)
        }

        const data = await response.json()

        if (!data.id || typeof data.nome !== "string") {
          throw new Error("Estrutura de dados inválida na resposta")
        }

        setRequerido(data)
        console.log("✅ Requerido carregado:", data)
      } catch (error) {
        if (!abortController.signal.aborted) {
          let errorMessage = "Falha ao carregar dados"
          if (error instanceof Error) {
            errorMessage += `: ${error.message}`
            console.error("Stack trace:", error.stack)
            console.error("❌ Erro detalhado:", errorMessage)
          }
          console.error("❌ Erro detalhado:", error)
          // Adicione tratamento de UI aqui (ex: toast.error(errorMessage))
        }
      }
    }

    fetchRequerido()

    return () => abortController.abort()
  }, [requeridoId])

  // 🔹 Carrega as listas auxiliares (Setores)
  useEffect(() => {
    async function fetchListas() {
      try {
        const response = await fetch("/api/setores")
        if (!response.ok) throw new Error("Erro ao buscar setores")
        const setores = await response.json()
        setListas((prev) => ({ ...prev, setores }))
        console.log("✅ Setores carregados!", setores)
      } catch (error) {
        console.error("❌ Erro ao carregar setores:", error)
      }
    }
    fetchListas()
  }, [])

  // 🔹 Busca dinâmica de CNAE conforme digitação (Lazy Load)
  useEffect(() => {
    if (cnaeSearch.length < 3) return // Evita muitas requisições

    async function fetchCnaes() {
      setLoadingCNAE(true)
      try {
        const response = await fetch(`/api/cnaes?search=${cnaeSearch}&limit=50`)
        if (!response.ok) throw new Error("Erro ao buscar CNAEs")
        const data = await response.json()
        setListas((prev) => ({ ...prev, cnaes: data }))
      } catch (error) {
        console.error("❌ Erro ao buscar CNAEs:", error)
      } finally {
        setLoadingCNAE(false)
      }
    }
    fetchCnaes()
  }, [cnaeSearch])

  // 🔹 Busca dados do CNPJ na BrasilAPI
  async function handleCnpjBlur() {
    if (!requerido?.cnpj || requerido.cnpj.replace(/\D/g, "").length !== 14) return

    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${requerido.cnpj.replace(/\D/g, "")}`
      )
      if (!response.ok) throw new Error("Erro ao buscar dados do CNPJ")
      const data = await response.json()

      setRequerido((prev) => ({
        ...prev!,
        nome: data.razao_social || prev?.nome,
      }))
    } catch (error) {
      console.error("❌ Erro ao buscar dados do CNPJ:", error)
    }
  }

  function handleCnpjChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRequerido((prev) => ({ ...prev!, cnpj: e.target.value }))
  }

  async function handleSave() {
    if (!requerido) return

    // Validar campos
    const emailValidation = validateEmail(requerido.email || "")
    const siteValidation = validateSite(requerido.site || "")

    if (emailValidation || siteValidation) {
      setEmailError(emailValidation || undefined)
      setSiteError(siteValidation || undefined)
      alert("Por favor, corrija os erros antes de salvar.")
      return
    }

    // Normalizar site
    let normalizedSite = requerido.site?.trim()
    if (normalizedSite) {
      try {
        const url = new URL(
          normalizedSite.includes("://") ? normalizedSite : `http://${normalizedSite}`
        )
        normalizedSite = url.toString()
      } catch (e) {
        console.error(e)
      }
    }

    const payload: RequeridoInput = {
      nome: requerido.nome,
      cnpj: requerido.cnpj,
      cnaeId: requerido.cnae?.id ?? undefined,
      site: normalizedSite || undefined,
      email: requerido.email || undefined,
      setorId: requerido.setor?.id ?? undefined,
    }

    let response
    if (requeridoId) {
      response = await fetch(`/api/requeridos/${requeridoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } else {
      response = await fetch(`/api/requeridos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    }

    if (response.ok) {
      alert("✅ Requerido salvo com sucesso!")
      if (onSave) onSave()
    } else {
      alert("❌ Erro ao salvar o Requerido!")
    }
  }

  if (!requerido) return <Typography>Carregando Requerido...</Typography>

  return (
    <Paper sx={{ p: 3, mx: "auto", mt: 2, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        {requeridoId ? "Editar Requerido" : "Criar Requerido"}
      </Typography>

      {/* CNPJ (Com máscara) */}
      <MaskedInput
        mask={[
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          "/",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
        ]}
        value={requerido?.cnpj || ""}
        onChange={handleCnpjChange}
        onBlur={handleCnpjBlur}
        render={(ref, props) => (
          <TextField {...props} inputRef={ref} fullWidth label="CNPJ" sx={{ mb: 2 }} />
        )}
      />

      {/* Nome do Requerido */}
      <TextField
        fullWidth
        label="Nome"
        name="nome"
        value={requerido.nome}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setRequerido({ ...requerido, nome: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      {/* E-mail */}
      <TextField
        fullWidth
        label="E-mail"
        name="email"
        value={requerido.email || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setRequerido({ ...requerido, email: e.target.value })
          setEmailError(validateEmail(e.target.value))
        }}
        onBlur={() => setEmailError(validateEmail(requerido.email || ""))}
        error={!!emailError}
        helperText={emailError}
        sx={{ mb: 2 }}
      />

      {/* Site */}
      <TextField
        fullWidth
        label="Site"
        name="site"
        value={requerido.site || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setRequerido({ ...requerido, site: e.target.value })
          setSiteError(validateSite(e.target.value))
        }}
        onBlur={() => setSiteError(validateSite(requerido.site || ""))}
        error={!!siteError}
        helperText={siteError}
        sx={{ mb: 2 }}
      />

      {/* CNAE - Agora com Autocomplete */}
      <Autocomplete
        fullWidth
        options={listas.cnaes}
        loading={loadingCNAE}
        getOptionLabel={(option) => `${option.code} - ${option.nome}`}
        value={requerido.cnae || null}
        onInputChange={(_, value) => setCnaeSearch(value)}
        onChange={(_, newValue) =>
          setRequerido((prev) => ({ ...prev!, cnae: newValue || undefined }))
        }
        renderInput={(params) => <TextField {...params} label="CNAE" sx={{ mb: 2 }} />}
      />

      {/* Setor */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Setor</InputLabel>
        <Select
          name="setorId"
          value={requerido.setor?.id || ""}
          onChange={(e) =>
            setRequerido({
              ...requerido,
              setor: listas.setores.find((item) => item.id === Number(e.target.value)),
            })
          }
        >
          {listas.setores.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSave}
      >
        {requeridoId ? "Salvar Alterações" : "Criar Requerido"}
      </Button>
    </Paper>
  )
}
