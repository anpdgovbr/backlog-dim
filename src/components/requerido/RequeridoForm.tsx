"use client"

import { Controller, FormProvider, useForm } from "react-hook-form"
import { mask, unmask } from "remask"

import { forwardRef, useEffect, useImperativeHandle } from "react"

import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"

import type { ControladorDto } from "@anpdgovbr/shared-types"
import { TipoControlador } from "@anpdgovbr/shared-types"

import { useNotification } from "@/context/NotificationProvider"
import { useBuscarCnpj } from "@/hooks/useBuscarCnpj"
import { validateEmail, validateSite, validateTelefone } from "@/utils/formUtils"

import { CnaeDropdownSection } from "../select/CnaeDropdownSection"
import { SetorDropdownSection } from "../select/SetorDropdownSection"

export interface RequeridoFormHandle {
  submit: () => void
}

export interface RequeridoFormProps {
  requeridoId: number | null
  onSave?: () => void
  mutate?: () => void
}

/**
 * Formulário para criação/edição de um Requerido (Controlador).
 *
 * @remarks
 * O componente usa `react-hook-form` e expõe um handle (`submit`) via
 * `forwardRef` para submissão programática. Faz validações locais e utiliza
 * `useBuscarCnpj` para preencher campos quando aplicável.
 *
 * @example
 * ```tsx
 * const ref = useRef<RequeridoFormHandle>(null)
 * <RequeridoForm ref={ref} requeridoId={null} onSave={() => {}} />
 * // para submeter programaticamente: ref.current?.submit()
 * ```
 */
const RequeridoForm = forwardRef<RequeridoFormHandle, RequeridoFormProps>(
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

    // eslint-disable-next-line react-hooks/incompatible-library -- watch() do React Hook Form é necessário para reatividade
    const tipo = watch("tipo")
    const cnpj = watch("cnpj")
    const { notify } = useNotification()

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit((data) => {
          let hasErrors = false

          const emailVal = data.email ? validateEmail(data.email) : null
          const siteVal = data.site ? validateSite(data.site) : null
          const telefoneVal = data.telefone ? validateTelefone(data.telefone) : null
          const politicaUrlVal = data.politicaPrivacidadeUrl
            ? validateSite(data.politicaPrivacidadeUrl)
            : null

          if (!data.nome) {
            setError("nome", { message: "Nome é obrigatório" })
            hasErrors = true
          }

          if (emailVal) {
            setError("email", { message: emailVal })
            hasErrors = true
          } else {
            clearErrors("email")
          }

          if (siteVal) {
            setError("site", { message: siteVal })
            hasErrors = true
          } else {
            clearErrors("site")
          }

          if (telefoneVal) {
            setError("telefone", { message: telefoneVal })
            hasErrors = true
          } else {
            clearErrors("telefone")
          }

          if (politicaUrlVal) {
            setError("politicaPrivacidadeUrl", { message: politicaUrlVal })
            hasErrors = true
          } else {
            clearErrors("politicaPrivacidadeUrl")
          }

          if (data.tipo === TipoControlador.PESSOA_JURIDICA && !data.cnpj) {
            setError("cnpj", { message: "CNPJ é obrigatório para Pessoa Jurídica" })
            hasErrors = true
          }
          if (data.tipo === TipoControlador.PESSOA_NATURAL && !data.cpf) {
            setError("cpf", { message: "CPF é obrigatório para Pessoa Física" })
            hasErrors = true
          }

          if (hasErrors) {
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
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json()
            const errorMessage = Array.isArray(errorData.message)
              ? errorData.message.join(", ")
              : errorData.message || "Erro desconhecido"
            throw new Error(errorMessage)
          }
          return res.json()
        })
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
        .catch((error: Error) => {
          notify({
            type: "error",
            message: `Erro ao carregar o Requerido: ${error.message}`,
          })
        })
    }, [requeridoId, notify, setValue])

    useEffect(() => {
      setValue("cnpj", "")
      setValue("cpf", "")
    }, [tipo, setValue])

    const { buscarCnpj } = useBuscarCnpj()

    useEffect(() => {
      if (tipo !== TipoControlador.PESSOA_JURIDICA || !cnpj || cnpj.length !== 14) return

      async function preencherCampos() {
        if (!cnpj) return
        const dados = await buscarCnpj(cnpj)
        if (dados) {
          if (dados.razao_social) setValue("nome", dados.razao_social)
          if (dados.email) setValue("email", dados.email)
          if (dados.telefone) setValue("telefone", dados.telefone)
          if (dados.site) setValue("site", dados.site)
        }
      }

      preencherCampos()
    }, [cnpj, tipo, setValue, buscarCnpj])

    const onSubmit = async (data: ControladorDto) => {
      try {
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
          const errorData = await response.json()
          const errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(", ")
            : errorData.message || "Erro desconhecido"
          notify({
            type: "error",
            message: `Erro ao salvar o Requerido: ${errorMessage}`,
          })
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Erro inesperado"

        notify({
          type: "error",
          message: `Erro ao salvar o Requerido: ${errorMessage}`,
        })
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
                      error={!!errors.politicaPrivacidadeUrl}
                      helperText={errors.politicaPrivacidadeUrl?.message}
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
