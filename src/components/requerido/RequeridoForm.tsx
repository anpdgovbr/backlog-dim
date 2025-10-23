"use client"

import { Controller, FormProvider, useForm } from "react-hook-form"
import { mask, unmask } from "remask"

import { forwardRef, useEffect, useImperativeHandle } from "react"

import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"

import type { ControladorDto } from "@anpdgovbr/shared-types"
import { Esfera, Poder, SetorEmpresarial, TipoControlador } from "@anpdgovbr/shared-types"

import { useNotification } from "@/context/NotificationProvider"
import { useBuscarCnpj } from "@/hooks/useBuscarCnpj"
import { validateEmail, validateSite, validateTelefone } from "@/utils/formUtils"

import { CnaeDropdownSection } from "../select/CnaeDropdownSection"
import { SetorDropdownSection } from "../select/SetorDropdownSection"

export interface RequeridoFormHandle {
  submit: () => void
}

export interface RequeridoFormProps {
  requeridoId: string | null
  onSave?: () => void
  mutate?: () => Promise<unknown>
}

type RequeridoFormValues = {
  nomeEmpresarial: string
  nomeFantasia: string
  tipo: TipoControlador
  cnpj: string
  cpf: string
  email: string
  telefone: string
  site: string
  politicaPrivacidadeUrl: string
  setorEmpresarial: SetorEmpresarial
  esfera?: Esfera
  poder?: Poder
  setorId?: string | null
  cnaeId?: string | null
}

const TELEFONE_MASCARAS = ["(99) 9999-9999", "(99) 9 9999-9999"]
const DEFAULT_COUNTRY_CODE = "55"

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  try {
    const text = await response.text()
    if (!text) return null
    return JSON.parse(text) as T
  } catch (error) {
    console.error("Falha ao interpretar resposta da API de Requeridos:", error)
    return null
  }
}

const RequeridoForm = forwardRef<RequeridoFormHandle, RequeridoFormProps>(
  ({ requeridoId, onSave, mutate }, ref) => {
    const methods = useForm<RequeridoFormValues>({
      defaultValues: {
        nomeEmpresarial: "",
        nomeFantasia: "",
        tipo: TipoControlador.PESSOA_JURIDICA,
        cnpj: "",
        cpf: "",
        email: "",
        telefone: "",
        site: "",
        politicaPrivacidadeUrl: "",
        setorEmpresarial: SetorEmpresarial.PRIVADO,
        esfera: undefined,
        poder: undefined,
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

    // eslint-disable-next-line react-hooks/incompatible-library -- watch() é necessário para reatividade do formulário
    const tipo = watch("tipo")
    const cnpj = watch("cnpj")
    const setorEmpresarial = watch("setorEmpresarial")
    const { notify } = useNotification()

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(async (data) => {
          let hasErrors = false

          const trimmedNomeEmpresarial = data.nomeEmpresarial.trim()
          const trimmedEmail = data.email.trim()
          const trimmedSite = data.site.trim()
          const trimmedPolitica = data.politicaPrivacidadeUrl.trim()
          const trimmedTelefone = data.telefone.trim()

          if (!trimmedNomeEmpresarial) {
            setError("nomeEmpresarial", { message: "Nome empresarial é obrigatório" })
            hasErrors = true
          } else {
            clearErrors("nomeEmpresarial")
          }

          if (!trimmedEmail) {
            setError("email", { message: "E-mail é obrigatório" })
            hasErrors = true
          } else {
            const emailVal = validateEmail(trimmedEmail)
            if (emailVal) {
              setError("email", { message: emailVal })
              hasErrors = true
            } else {
              clearErrors("email")
            }
          }

          if (!trimmedSite) {
            setError("site", { message: "Site é obrigatório" })
            hasErrors = true
          } else {
            const siteVal = validateSite(trimmedSite)
            if (siteVal) {
              setError("site", { message: siteVal })
              hasErrors = true
            } else {
              clearErrors("site")
            }
          }

          if (!trimmedPolitica) {
            setError("politicaPrivacidadeUrl", {
              message: "Política de privacidade é obrigatória",
            })
            hasErrors = true
          } else {
            const politicaUrlVal = validateSite(trimmedPolitica)
            if (politicaUrlVal) {
              setError("politicaPrivacidadeUrl", { message: politicaUrlVal })
              hasErrors = true
            } else {
              clearErrors("politicaPrivacidadeUrl")
            }
          }

          if (!trimmedTelefone) {
            setError("telefone", { message: "Telefone é obrigatório" })
            hasErrors = true
          } else {
            const telefoneVal = validateTelefone(trimmedTelefone)
            if (telefoneVal) {
              setError("telefone", { message: telefoneVal })
              hasErrors = true
            } else {
              clearErrors("telefone")
            }
          }

          if (data.tipo === TipoControlador.PESSOA_JURIDICA) {
            if (!data.cnpj) {
              setError("cnpj", {
                message: "CNPJ é obrigatório para Pessoa Jurídica",
              })
              hasErrors = true
            } else {
              clearErrors("cnpj")
            }
          }

          if (data.tipo === TipoControlador.PESSOA_NATURAL) {
            if (!data.cpf) {
              setError("cpf", {
                message: "CPF é obrigatório para Pessoa Física",
              })
              hasErrors = true
            } else {
              clearErrors("cpf")
            }
          }

          if (!data.setorId) {
            setError("setorId", { message: "Selecione um setor" })
            hasErrors = true
          } else {
            clearErrors("setorId")
          }

          if (!data.cnaeId) {
            setError("cnaeId", { message: "Selecione um CNAE" })
            hasErrors = true
          } else {
            clearErrors("cnaeId")
          }

          if (data.setorEmpresarial === SetorEmpresarial.PUBLICO) {
            if (!data.esfera) {
              setError("esfera", { message: "Informe a esfera" })
              hasErrors = true
            } else {
              clearErrors("esfera")
            }

            if (!data.poder) {
              setError("poder", { message: "Informe o poder" })
              hasErrors = true
            } else {
              clearErrors("poder")
            }
          } else {
            clearErrors("esfera")
            clearErrors("poder")
          }

          if (hasErrors) {
            notify({ type: "warning", message: "Corrija os erros antes de salvar." })
            return
          }

          const payload: ControladorDto = {
            nomeEmpresarial: trimmedNomeEmpresarial,
            nomeFantasia: data.nomeFantasia.trim() || undefined,
            tipo: data.tipo,
            cpf:
              data.tipo === TipoControlador.PESSOA_NATURAL ? data.cpf.trim() : undefined,
            cnpj:
              data.tipo === TipoControlador.PESSOA_JURIDICA && data.cnpj
                ? data.cnpj
                : undefined,
            site: trimmedSite,
            emails: [{ email: trimmedEmail }],
            telefones: [
              {
                codigoPais: DEFAULT_COUNTRY_CODE,
                telefone: unmask(trimmedTelefone),
              },
            ],
            politicaPrivacidadeUrl: trimmedPolitica,
            setorEmpresarial: data.setorEmpresarial,
            esfera:
              data.setorEmpresarial === SetorEmpresarial.PUBLICO
                ? data.esfera
                : undefined,
            poder:
              data.setorEmpresarial === SetorEmpresarial.PUBLICO ? data.poder : undefined,
            setorId: data.setorId as string,
            cnaeId: data.cnaeId as string,
          }

          await onSubmit(payload)
        })()
      },
    }))

    useEffect(() => {
      if (!requeridoId) return

      fetch(`/api/controladores/${requeridoId}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await parseJsonSafe<{ message?: string; error?: string }>(
              res
            )
            const message = errorData?.message || errorData?.error || "Erro desconhecido"
            throw new Error(message)
          }
          return parseJsonSafe<ControladorDto>(res)
        })
        .then((data) => {
          if (!data) return

          setValue("nomeEmpresarial", data.nomeEmpresarial ?? "")
          setValue("nomeFantasia", data.nomeFantasia ?? "")
          setValue("tipo", data.tipo ?? TipoControlador.PESSOA_JURIDICA)
          setValue("cnpj", data.cnpj ?? "")
          setValue("cpf", data.cpf ?? "")
          setValue("email", data.emails?.[0]?.email ?? "")
          const telefonePrimeiro = data.telefones?.[0]?.telefone ?? ""
          setValue(
            "telefone",
            telefonePrimeiro ? mask(telefonePrimeiro, TELEFONE_MASCARAS) : ""
          )
          setValue("site", data.site ?? "")
          setValue("politicaPrivacidadeUrl", data.politicaPrivacidadeUrl ?? "")
          setValue("setorEmpresarial", data.setorEmpresarial ?? SetorEmpresarial.PRIVADO)
          setValue("esfera", data.esfera ?? undefined)
          setValue("poder", data.poder ?? undefined)
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

    useEffect(() => {
      if (setorEmpresarial !== SetorEmpresarial.PUBLICO) {
        setValue("esfera", undefined)
        setValue("poder", undefined)
      }
    }, [setorEmpresarial, setValue])

    const { buscarCnpj } = useBuscarCnpj()

    useEffect(() => {
      if (tipo !== TipoControlador.PESSOA_JURIDICA || !cnpj || cnpj.length !== 14) return

      async function preencherCampos() {
        const dados = await buscarCnpj(cnpj)
        if (dados) {
          if (dados.razao_social) setValue("nomeEmpresarial", dados.razao_social)
          if (dados.nome_fantasia) setValue("nomeFantasia", dados.nome_fantasia)
          if (dados.email) setValue("email", dados.email)
          if (dados.telefone)
            setValue("telefone", mask(dados.telefone, TELEFONE_MASCARAS))
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
            method: requeridoId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        )

        if (response.ok) {
          notify({ type: "success", message: "Requerido salvo com sucesso!" })
          await mutate?.()
          onSave?.()
          return
        }

        const errorData = await parseJsonSafe<{ message?: string; error?: string }>(
          response
        )
        const errorMessage = errorData?.message || errorData?.error || "Erro desconhecido"

        notify({
          type: "error",
          message: `Erro ao salvar o Requerido: ${errorMessage}`,
        })
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
                  name="nomeEmpresarial"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nome Empresarial"
                      fullWidth
                      size="small"
                      error={!!errors.nomeEmpresarial}
                      helperText={errors.nomeEmpresarial?.message}
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
                  name="nomeFantasia"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Nome Fantasia" fullWidth size="small" />
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
                      value={mask(unmask(field.value || ""), TELEFONE_MASCARAS)}
                      onChange={(e) => field.onChange(unmask(e.target.value))}
                      label="Telefone"
                      fullWidth
                      size="small"
                      error={!!errors.telefone}
                      helperText={errors.telefone?.message}
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
                <Controller
                  name="setorEmpresarial"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Setor Empresarial"
                      fullWidth
                      select
                      size="small"
                    >
                      <MenuItem value={SetorEmpresarial.PRIVADO}>Privado</MenuItem>
                      <MenuItem value={SetorEmpresarial.PUBLICO}>Público</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              {setorEmpresarial === SetorEmpresarial.PUBLICO && (
                <>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <Controller
                      name="esfera"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Esfera"
                          fullWidth
                          select
                          size="small"
                          error={!!errors.esfera}
                          helperText={errors.esfera?.message}
                        >
                          <MenuItem value={Esfera.MUNICIPAL}>Municipal</MenuItem>
                          <MenuItem value={Esfera.ESTADUAL}>Estadual</MenuItem>
                          <MenuItem value={Esfera.FEDERAL}>Federal</MenuItem>
                        </TextField>
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
                      name="poder"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Poder"
                          fullWidth
                          select
                          size="small"
                          error={!!errors.poder}
                          helperText={errors.poder?.message}
                        >
                          <MenuItem value={Poder.EXECUTIVO}>Executivo</MenuItem>
                          <MenuItem value={Poder.LEGISLATIVO}>Legislativo</MenuItem>
                          <MenuItem value={Poder.JUDICIARIO}>Judiciário</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                </>
              )}

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
