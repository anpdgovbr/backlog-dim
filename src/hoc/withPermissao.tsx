"use client"

import usePermissoes from "@/hooks/usePermissoes"
import { AcaoPermissao, PermissaoConcedida, RecursoPermissao } from "@anpd/shared-types"
import { Alert, AlertTitle, Button, Container, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { ComponentType, useEffect } from "react"

interface WithPermissaoOptions {
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
