"use client"

import type { ComponentType } from "react"
import { useEffect, useRef } from "react"

import { useRouter } from "next/navigation"

import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import type { AcaoPermissao, RecursoPermissao } from "@anpdgovbr/shared-types"

import usePermissoes from "@/hooks/usePermissoes"
import { pode } from "@/lib/permissions"

/**
 * Opções do HOC `withPermissao`.
 *
 * @remarks
 * Este HOC atua como camada de UX no cliente. A segurança real deve ser
 * garantida no servidor via `withApi`/`withApiSlim`. No futuro, é possível
 * migrar para habilitar/ocultar ações com base em capacidades vindas da sessão
 * (ou cache leve no servidor), reduzindo dependência de chamadas SWR.
 */
export interface WithPermissaoOptions {
  redirecionar?: boolean
}

/**
 * HOC para proteger componentes/client-side com base em permissões RBAC.
 *
 * @remarks
 * - Útil para UX (exibir/ocultar ações), mas não substitui checagens no servidor.
 * - Futuro: pode ser substituído por um provider de "capabilities" hidratado do
 *   servidor, ou por hooks que leem permissões consolidadas na sessão JWT.
 */
export default function withPermissao<T extends object>(
  Componente: ComponentType<T>,
  acao: AcaoPermissao,
  recurso: RecursoPermissao,
  { redirecionar = true }: WithPermissaoOptions = {}
) {
  return function Protegido(props: T) {
    const { permissoes, loading } = usePermissoes()
    const router = useRouter()

    const acaoRef = useRef<AcaoPermissao>(acao)
    const recursoRef = useRef<RecursoPermissao>(recurso)
    const redirecionarRef = useRef<boolean>(redirecionar)

    useEffect(() => {
      if (loading) return

      if (
        !pode(permissoes, acaoRef.current, recursoRef.current) &&
        redirecionarRef.current
      ) {
        router.push("/acesso-negado")
      }
    }, [loading, permissoes, router])

    if (loading) {
      return (
        <Container maxWidth="lg">
          <Typography variant="body1">Carregando permissões...</Typography>
        </Container>
      )
    }

    if (!pode(permissoes, acao, recurso)) {
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
