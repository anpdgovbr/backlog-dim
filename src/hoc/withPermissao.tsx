"use client"

import type { ComponentType } from "react"
import { useEffect } from "react"

import { useRouter } from "next/navigation"

import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import type {
  AcaoPermissao,
  PermissaoConcedida,
  RecursoPermissao,
} from "@anpdgovbr/shared-types"

import usePermissoes from "@/hooks/usePermissoes"

export interface WithPermissaoOptions {
  redirecionar?: boolean
}

export default function withPermissao<T extends object>(
  Componente: ComponentType<T>,
  acao: AcaoPermissao,
  recurso: RecursoPermissao,
  { redirecionar = true }: WithPermissaoOptions = {}
) {
  return function Protegido(props: T) {
    const { permissoes, loading } = usePermissoes()
    const router = useRouter()
    const chavePermissao = `${acao}_${recurso}` as PermissaoConcedida

    useEffect(() => {
      if (loading) return

      if (permissoes?.[chavePermissao] === undefined) return

      if (!permissoes[chavePermissao] && redirecionar) {
        router.push("/acesso-negado")
      }
    }, [loading, permissoes, chavePermissao, router])

    if (loading || permissoes?.[chavePermissao] === undefined) {
      return (
        <Container maxWidth="lg">
          <Typography variant="body1">Carregando permissões...</Typography>
        </Container>
      )
    }

    if (!permissoes[chavePermissao]) {
      return redirecionar ? null : (
        <Container maxWidth="lg">
          <Alert severity="error" variant="filled">
            <AlertTitle>Acesso Negado</AlertTitle>
            <Typography variant="body1" color="inherit">
              Você não possui permissão para realizar a ação <strong>{acao}</strong> no
              recurso <strong>{recurso}</strong>. Caso precise de acesso, entre em contato
              com o administrador do sistema.
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ mt: 2 }}
              onClick={() => router.back()}
            >
              Voltar
            </Button>
          </Alert>
        </Container>
      )
    }

    return <Componente {...props} />
  }
}
