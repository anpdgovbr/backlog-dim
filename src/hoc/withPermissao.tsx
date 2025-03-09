import usePermissoes from "@/hooks/usePermissoes"
import { Alert, AlertTitle, Button, Container, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { ComponentType, useEffect } from "react"

interface WithPermissaoOptions {
  redirecionar?: boolean
}

export default function withPermissao<T extends object>(
  Componente: ComponentType<T>,
  acao: string,
  recurso: string,
  { redirecionar = true }: WithPermissaoOptions = {} // 🔹 Padrão: redireciona, mas pode ser desativado
) {
  return function Protegido(props: T) {
    const { permissoes, loading } = usePermissoes()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !permissoes[`${acao}_${recurso}`] && redirecionar) {
        router.push("/acesso-negado")
      }
      // 🔹 eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissoes, loading, router])

    if (loading) return <p>Carregando permissões...</p>

    // 🔹 Se não tem permissão e `redirecionar` for `false`, apenas não exibe o conteúdo
    if (!permissoes[`${acao}_${recurso}`]) {
      return redirecionar ? null : (
        <Container maxWidth="md">
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
