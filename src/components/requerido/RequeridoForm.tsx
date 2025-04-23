"use client"

import { useNotification } from "@/context/NotificationProvider"
import type { RequeridoInput, RequeridoOutput } from "@/types/Requerido"
import { validateEmail, validateSite } from "@/utils/formUtils"
import type { CnaeDto, EnumData } from "@anpd/shared-types"
import { TipoControlador } from "@anpd/shared-types"
import { Autocomplete, Grid, Paper, TextField } from "@mui/material"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"

import { SetorDropdownSection } from "../select/SetorDropdownSection"

export interface RequeridoFormHandle {
  submit: () => void
}

interface Props {
  requeridoId: number | null
  onSave?: () => void
  mutate?: () => void
}

const RequeridoForm = forwardRef<RequeridoFormHandle, Props>(
  ({ requeridoId, onSave, mutate }, ref) => {
    const methods = useForm<RequeridoInput>({
      defaultValues: {
        nome: "",
        cnpj: "",
        email: "",
        site: "",
        setorId: undefined,
        cnaeId: undefined,
        tipo: TipoControlador.PESSOA_JURIDICA,
      },
    })

    const {
      control,
      handleSubmit,
      setValue,
      setError,
      clearErrors,
      formState: { errors },
    } = methods

    const { notify } = useNotification()
    const [listas, setListas] = useState<{ setores: EnumData[]; cnaes: CnaeDto[] }>({
      setores: [],
      cnaes: [],
    })
    const [cnaeSearch, setCnaeSearch] = useState("")
    const [loadingCNAE, setLoadingCNAE] = useState(false)

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
    }))

    useEffect(() => {
      if (!requeridoId) return
      fetch(`/api/controladores/${requeridoId}`)
        .then((res) => res.json())
        .then((data: RequeridoOutput) => {
          setValue("nome", data.nome)
          setValue("cnpj", data.cnpj || "")
          setValue("email", data.email || "")
          setValue("site", data.site || "")
          setValue("cnaeId", data.cnae?.id)
          setValue("setorId", data.setor?.id)
          setValue("tipo", data.tipo)
        })
        .catch(() => notify({ type: "error", message: "Erro ao carregar o Requerido" }))
    }, [requeridoId, setValue, notify])

    useEffect(() => {
      if (cnaeSearch.length < 3) return
      setLoadingCNAE(true)
      fetch(`/api/cnaes?search=${cnaeSearch}&limit=50`)
        .then((res) => res.json())
        .then((data) => setListas((prev) => ({ ...prev, cnaes: data })))
        .finally(() => setLoadingCNAE(false))
    }, [cnaeSearch])

    const onSubmit = async (data: RequeridoInput) => {
      const emailVal = validateEmail(data.email || "")
      const siteVal = validateSite(data.site || "")

      if (emailVal) setError("email", { message: emailVal })
      else clearErrors("email")

      if (siteVal) setError("site", { message: siteVal })
      else clearErrors("site")

      if (emailVal || siteVal) {
        notify({ type: "warning", message: "Corrija os erros antes de salvar." })
        return
      }

      const payload: RequeridoInput = {
        ...data,
        site: data.site?.trim() || undefined,
        email: data.email?.trim() || undefined,
      }

      const response = await fetch(
        `/api/controladores${requeridoId ? `/${requeridoId}` : ""}`,
        {
          method: requeridoId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        notify({ type: "success", message: "Requerido salvo com sucesso!" })
        mutate?.()
        onSave?.()
      } else {
        notify({ type: "error", message: "Erro ao salvar o Requerido" })
      }
    }

    return (
      <FormProvider {...methods}>
        <form noValidate>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Grid container spacing={1}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Controller
                  name="cnpj"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="CNPJ" fullWidth size="small" />
                  )}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Controller
                  name="nome"
                  control={control}
                  rules={{ required: "Nome é obrigatório" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nome"
                      fullWidth
                      size="small"
                      error={!!errors.nome}
                      helperText={errors.nome?.message}
                    />
                  )}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="E-mail"
                      fullWidth
                      size="small"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Controller
                  name="site"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Site"
                      fullWidth
                      size="small"
                      error={!!errors.site}
                      helperText={errors.site?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="cnaeId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={listas.cnaes}
                      getOptionLabel={(o) => `${o.code} - ${o.nome}`}
                      loading={loadingCNAE}
                      value={listas.cnaes.find((c) => c.id === value) || null}
                      onInputChange={(_, val) => setCnaeSearch(val)}
                      onChange={(_, newVal) => onChange(newVal?.id)}
                      renderInput={(params) => (
                        <TextField {...params} label="CNAE" size="small" />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <SetorDropdownSection label="Setor" name="setorId" hasAllOption={false} />
              </Grid>
            </Grid>
          </Paper>
        </form>
      </FormProvider>
    )
  }
)
RequeridoForm.displayName = "RequeridoForm"

export default RequeridoForm
