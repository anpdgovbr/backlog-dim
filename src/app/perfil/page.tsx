"use client"

import useSWR from "swr"
import { useMemo } from "react"

import { useSession } from "next-auth/react"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
// Usando CSS Grid via Box para garantir compatibilidade
import { GovBRButton } from "@anpdgovbr/shared-ui"
import Link from "next/link"
import Alert from "@mui/material/Alert"

import { PageLayout } from "@/components/layouts"
import { fetcher } from "@/lib/fetcher"

/**
 * DTO que representa o perfil do usuário retornado pela API.
 *
 * @property id - Identificador único do perfil.
 * @property nome - Nome legível do perfil (ex.: "Administrador").
 */
type PerfilDto = { id: number; nome: string }

/**
 * DTO que descreve uma permissão efetiva para um recurso.
 *
 * @property acao - Ação permitida/examinada (ex.: "read", "create", "delete").
 * @property recurso - Recurso ao qual a ação se aplica (ex.: "processos").
 * @property permitido - Indica se a ação está efetivamente permitida.
 * @property perfilNome - (Opcional) nome do perfil que conferiu essa permissão.
 */
type PermissaoDto = {
  acao: string
  recurso: string
  permitido: boolean
  perfilNome?: string
}

/**
 * DTO que descreve a herança de perfis aplicada ao usuário.
 *
 * @property base - Nome do perfil base na cadeia de herança.
 * @property cadeia - Lista de nomes de perfis aplicados, em ordem (da base para o mais específico).
 */
type HerancaDto = { base: string; cadeia: string[] }

/**
 * Página do Meu Perfil (componente cliente).
 *
 * Exibe informações da conta autenticada, perfil associado, permissões efetivas agrupadas por recurso
 * e a cadeia de herança de perfis. Os dados são carregados via SWR a partir das rotas internas de API.
 *
 * Observações:
 * - Componente executado no cliente ("use client").
 * - Utiliza next-auth para obter sessão e SWR para fetch de dados.
 */
export default function PerfilPage() {
  const { data: session, status } = useSession()
  const user = (session?.user ?? undefined) as
    | { id?: string; name?: string | null; email?: string | null; image?: string | null }
    | undefined
  const { data: perfil, isLoading: loadingPerfil } = useSWR<PerfilDto>(
    status === "authenticated" ? "/api/perfil" : null,
    fetcher
  )
  const { data: permissoes, isLoading: loadingPerms } = useSWR<PermissaoDto[]>(
    status === "authenticated" ? "/api/permissoes" : null,
    fetcher
  )
  const { data: heranca, isLoading: loadingHeranca } = useSWR<HerancaDto>(
    status === "authenticated" ? "/api/perfil/heranca" : null,
    fetcher
  )

  const permissoesPorRecurso = useMemo(() => {
    const map = new Map<string, Array<{ acao: string; perfilNome?: string }>>()
    if (!Array.isArray(permissoes)) return map
    for (const p of permissoes) {
      if (!p.permitido) continue
      const list = map.get(p.recurso) ?? []
      if (!list.find((i) => i.acao === p.acao))
        list.push({ acao: p.acao, perfilNome: p.perfilNome })
      map.set(
        p.recurso,
        list.toSorted((a, b) => a.acao.localeCompare(b.acao))
      )
    }
    return map
  }, [permissoes])

  const isLoading = status === "loading" || loadingPerfil || loadingPerms

  if (status === "unauthenticated") {
    return (
      <PageLayout
        maxWidth="sm"
        loading={false}
        header={{
          title: "Meu Perfil",
          subtitle: "Acesso restrito a usuários autenticados",
          description: "Faça login para visualizar os dados do seu perfil.",
          variant: "default",
        }}
      >
        <Alert severity="info" sx={{ mb: 2 }}>
          Você não está autenticado. Para acessar seu perfil, clique em “Entrar”.
        </Alert>
        <Box sx={{ display: "flex", gap: 2 }}>
          <GovBRButton component={Link} href="/auth/login" variant="contained">
            Entrar
          </GovBRButton>
          <GovBRButton component={Link} href="/" variant="outlined">
            Voltar ao início
          </GovBRButton>
        </Box>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      maxWidth="lg"
      loading={isLoading}
      header={{
        title: "Meu Perfil",
        subtitle: "Conta e permissões",
        description: "Dados da conta, perfil e permissões efetivas",
        variant: "default",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "stretch",
        }}
      >
        <Box>
          <Card>
            <CardHeader title="Informações da Conta" />
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={user?.image || ""} sx={{ width: 72, height: 72 }}>
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user?.name || "Usuário"}
                  </Typography>
                  <Typography color="text.secondary">{user?.email}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 1 }}>
                <Typography color="text.secondary">ID do Usuário</Typography>
                <Typography sx={{ wordBreak: "break-all" }}>{user?.id || "—"}</Typography>

                <Typography color="text.secondary">Sessão expira</Typography>
                <Typography>
                  {session?.expires ? new Date(session.expires).toLocaleString() : "—"}
                </Typography>

                <Typography color="text.secondary">Perfil</Typography>
                <Typography>
                  {perfil?.nome || (loadingPerfil ? "Carregando..." : "Não definido")}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <GovBRButton
                  component={Link}
                  href="/auth/logout"
                  variant="outlined"
                  color="error"
                >
                  Sair
                </GovBRButton>
                <GovBRButton
                  component={Link}
                  href="/dashboard"
                  variant="contained"
                  color="primary"
                >
                  Ir ao Dashboard
                </GovBRButton>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader title="Permissões Efetivas" subheader="Agrupadas por recurso" />
            <CardContent>
              {loadingPerms && (
                <Typography color="text.secondary">Carregando permissões...</Typography>
              )}
              {!loadingPerms && (!permissoes || permissoes.length === 0) && (
                <Typography color="text.secondary">
                  Nenhuma permissão disponível.
                </Typography>
              )}

              {!loadingPerms && permissoesPorRecurso.size > 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {Array.from(permissoesPorRecurso.entries()).map(([recurso, acoes]) => (
                    <Box key={recurso}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {recurso}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {acoes.map(({ acao, perfilNome }) => (
                          <Box
                            key={`${recurso}-${acao}`}
                            sx={{ display: "flex", gap: 1, alignItems: "center" }}
                          >
                            <Chip
                              label={acao}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {perfilNome && (
                              <Chip label={perfilNome} size="small" variant="outlined" />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader
              title="Herança de Perfis"
              subheader="Perfis aplicados ao seu acesso"
            />
            <CardContent>
              {loadingHeranca && (
                <Typography color="text.secondary">Carregando herança...</Typography>
              )}
              {!loadingHeranca && heranca && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {heranca.cadeia.map((nome) => (
                    <Chip
                      key={nome}
                      label={nome}
                      size="small"
                      color={nome === heranca.base ? "primary" : "default"}
                    />
                  ))}
                </Box>
              )}
              {!loadingHeranca && !heranca && (
                <Typography color="text.secondary">
                  Não foi possível carregar a herança.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ gridColumn: { md: "1 / -1" } }}>
          <Card>
            <CardHeader title="Informações" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Este painel reflete o seu perfil atual e as permissões efetivas aplicadas
                no sistema. Alterações administrativas podem levar alguns segundos para
                refletir devido a cache de curto prazo.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </PageLayout>
  )
}
