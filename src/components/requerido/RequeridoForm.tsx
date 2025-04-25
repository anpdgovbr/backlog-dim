"use client"

import { useNotification } from "@/context/NotificationProvider"
import { validateEmail, validateSite } from "@/utils/formUtils"
import type { ControladorDto } from "@anpd/shared-types"
import { TipoControlador } from "@anpd/shared-types"
import { Grid, MenuItem, Paper, TextField } from "@mui/material"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { mask, unmask } from "remask"

import { CnaeDropdownSection } from "../select/CnaeDropdownSection"
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
    const methods = useForm<ControladorDto>({
      defaultValues: {
        nome: "",
        cnpj: "",
        cpf: "",
        tipo: TipoControlador.PESSOA_JURIDICA,
        email: "",
        site: "",
        telefone: "",
        politicaPrivacidadeUrl: "",
        setorId: undefined,
        cnaeId: undefined,
      },
    })

    const {
      control,
      handleSubmit,
      setValue,
      setError,
      clearErrors,
      watch,
      formState: { errors },
    } = methods

    const tipo = watch("tipo")
    const cnpj = watch("cnpj")
    const { notify } = useNotification()

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit((data) => {
          const emailVal = data.email ? validateEmail(data.email) : null
          const siteVal = data.site ? validateSite(data.site) : null

          if (emailVal) setError("email", { message: emailVal })
          else clearErrors("email")

          if (siteVal) setError("site", { message: siteVal })
          else clearErrors("site")

          if (data.tipo === TipoControlador.PESSOA_JURIDICA && !data.cnpj) {
            setError("cnpj", { message: "CNPJ é obrigatório para Pessoa Jurídica" })
          }
          if (data.tipo === TipoControlador.PESSOA_NATURAL && !data.cpf) {
            setError("cpf", { message: "CPF é obrigatório para Pessoa Física" })
          }

          if (
            emailVal ||
            siteVal ||
            (data.tipo === TipoControlador.PESSOA_JURIDICA && !data.cnpj) ||
            (data.tipo === TipoControlador.PESSOA_NATURAL && !data.cpf)
          ) {
            notify({ type: "warning", message: "Corrija os erros antes de salvar." })
            return
          }

          const payload = Object.fromEntries(
            Object.entries(data).filter(
              ([_, value]) => value !== "" && value !== null && value !== undefined
            )
          )

          onSubmit(payload as ControladorDto)
        })()
      },
    }))

    useEffect(() => {
      if (!requeridoId) return
      fetch(`/api/controladores/${requeridoId}`)
        .then((res) => res.json())
        .then((data: ControladorDto) => {
          setValue("nome", data.nome ?? "")
          setValue("tipo", data.tipo)
          setValue("cnpj", data.cnpj ?? "")
          setValue("cpf", data.cpf ?? "")
          setValue("email", data.email ?? "")
          setValue("site", data.site ?? "")
          setValue("telefone", data.telefone ?? "")
          setValue("politicaPrivacidadeUrl", data.politicaPrivacidadeUrl ?? "")
          setValue("cnaeId", data.cnaeId ?? undefined)
          setValue("setorId", data.setorId ?? undefined)
        })
        .catch(() => notify({ type: "error", message: "Erro ao carregar o Requerido" }))
    }, [requeridoId, notify, setValue])

    useEffect(() => {
      setValue("cnpj", "")
      setValue("cpf", "")
    }, [tipo, setValue])

    useEffect(() => {
      if (tipo !== TipoControlador.PESSOA_JURIDICA || !cnpj || cnpj.length !== 14) return

      fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.razao_social) setValue("nome", data.razao_social)
          if (data.email) setValue("email", data.email)
          if (data.telefone) setValue("telefone", data.telefone)
          if (data.site) setValue("site", data.site)
        })
        .catch(() => {
          notify({
            type: "warning",
            message: "Não foi possível buscar dados do CNPJ informado.",
          })
        })
    }, [cnpj, tipo, setValue, notify])

    const onSubmit = async (data: ControladorDto) => {
      const response = await fetch(
        `/api/controladores${requeridoId ? `/${requeridoId}` : ""}`,
        {
          method: requeridoId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
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
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Tipo" fullWidth select size="small">
                      <MenuItem value={TipoControlador.PESSOA_JURIDICA}>
                        Pessoa Jurídica
                      </MenuItem>
                      <MenuItem value={TipoControlador.PESSOA_NATURAL}>
                        Pessoa Física
                      </MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              {tipo === TipoControlador.PESSOA_JURIDICA && (
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
                      <TextField
                        {...field}
                        value={mask(unmask(field.value || ""), "99.999.999/9999-99")}
                        onChange={(e) => field.onChange(unmask(e.target.value))}
                        label="CNPJ"
                        fullWidth
                        size="small"
                        error={!!errors.cnpj}
                        helperText={errors.cnpj?.message}
                        slotProps={{ input: { inputMode: "numeric" } }}
                      />
                    )}
                  />
                </Grid>
              )}
              {tipo === TipoControlador.PESSOA_NATURAL && (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={mask(unmask(field.value || ""), "999.999.999-99")}
                        onChange={(e) => field.onChange(unmask(e.target.value))}
                        label="CPF"
                        fullWidth
                        size="small"
                        error={!!errors.cpf}
                        helperText={errors.cpf?.message}
                        slotProps={{ input: { inputMode: "numeric" } }}
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Controller
                  name="nome"
                  control={control}
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
                  name="telefone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={mask(unmask(field.value || ""), [
                        "(99) 9999-9999",
                        "(99) 9 9999-9999",
                      ])}
                      onChange={(e) => field.onChange(unmask(e.target.value))}
                      label="Telefone"
                      fullWidth
                      size="small"
                      slotProps={{ input: { inputMode: "numeric" } }}
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

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Controller
                  name="politicaPrivacidadeUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Política de Privacidade (URL)"
                      fullWidth
                      size="small"
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
                <CnaeDropdownSection name="cnaeId" label="CNAE" />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
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
