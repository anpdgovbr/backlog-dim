"use client"
import Link from "next/link"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CodeIcon from "@mui/icons-material/Code"
import DashboardIcon from "@mui/icons-material/Dashboard"
import GroupIcon from "@mui/icons-material/Group"
import SecurityIcon from "@mui/icons-material/Security"
import SpeedIcon from "@mui/icons-material/Speed"
import Box from "@mui/material/Box"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

/**
 * Lista de tecnologias utilizadas pelo projeto.
 *
 * Cada item é uma string com o nome (e quando aplicável, a versão) da tecnologia
 * usada no stack do Backlog DIM. Utilizado para renderizar chips na seção
 * "Tecnologias" da página.
 */
const tecnologias = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Material-UI v7",
  "Prisma 6",
  "PostgreSQL",
  "Keycloak (ANPD)",
  "Docker",
]

/**
 * Dados das principais funcionalidades exibidas na página.
 *
 * Cada item contém:
 * - icon: elemento React usado como ícone visual (React.ReactElement)
 * - titulo: título curto da funcionalidade
 * - descricao: descrição resumida da funcionalidade
 *
 * Tipagem implícita esperada: Array<{ icon: React.ReactElement; titulo: string; descricao: string }>
 */
const funcionalidades = [
  {
    icon: <DashboardIcon />,
    titulo: "Dashboard Avançado",
    descricao: "Painéis interativos com estatísticas e métricas em tempo real",
  },
  {
    icon: <SecurityIcon />,
    titulo: "Segurança Robusta",
    descricao: "Autenticação Keycloak e controle granular de permissões",
  },
  {
    icon: <SpeedIcon />,
    titulo: "Performance",
    descricao: "Tecnologias modernas para máxima velocidade e eficiência",
  },
  {
    icon: <GroupIcon />,
    titulo: "Gestão Colaborativa",
    descricao: "Controle de responsáveis e auditoria completa de ações",
  },
]

/**
 * Componente de página "Sobre".
 *
 * Renderiza a página institucional com:
 * - Cabeçalho e descrição do projeto
 * - Lista de funcionalidades principais (cards)
 * - Lista de tecnologias (chips)
 * - Informações institucionais e navegação
 *
 * @returns JSX.Element - Conteúdo da página "Sobre o Backlog DIM"
 */
export default function SobrePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Sobre o Backlog DIM
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Sistema moderno de gestão de processos administrativos da Divisão de
          Monitoramento da ANPD
        </Typography>
      </Box>

      {/* Descrição Principal */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
          O <strong>Backlog DIM</strong> é uma aplicação CRUD moderna e segura,
          desenvolvida especificamente para apoiar a{" "}
          <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> no
          gerenciamento eficiente dos processos administrativos da DIM.
        </Typography>

        <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
          A plataforma oferece controle completo sobre o ciclo de vida dos processos,
          desde o cadastro inicial até a conclusão, com rastreabilidade total,
          responsáveis designados e dashboards analíticos para tomada de decisões
          estratégicas.
        </Typography>

        <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
          Seguindo as diretrizes do <strong>Padrão Digital de Governo (Gov.br)</strong>, o
          sistema garante acessibilidade, usabilidade e conformidade com os padrões
          governamentais.
        </Typography>
      </Paper>

      {/* Funcionalidades */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" mb={4}>
          Principais Funcionalidades
        </Typography>

        <Grid container spacing={3}>
          {funcionalidades.map((func, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        mr: 2,
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {func.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {func.titulo}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {func.descricao}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tecnologias */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" mb={4}>
          Tecnologias
        </Typography>

        <Paper elevation={1} sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CodeIcon sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h6" fontWeight={600}>
              Stack Tecnológico Moderno
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tecnologias.map((tech, index) => (
              <Chip
                key={index}
                label={tech}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary">
            Desenvolvido com as mais recentes tecnologias web, garantindo performance,
            segurança e escalabilidade para atender às demandas da ANPD.
          </Typography>
        </Paper>
      </Box>

      {/* Informações Institucionais */}
      <Paper
        elevation={1}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #f5f5f5, #e8f5e8)",
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Desenvolvimento Institucional
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sistema desenvolvido pela equipe da{" "}
          <strong>DDSS/CGTI da Autoridade Nacional de Proteção de Dados</strong>, seguindo
          as melhores práticas de desenvolvimento de software e os padrões de segurança
          governamentais.
        </Typography>
      </Paper>

      {/* Navegação */}
      <Box
        sx={{ textAlign: "center", display: "flex", gap: 2, justifyContent: "center" }}
      >
        <GovBRButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          href="/"
        >
          Voltar ao Início
        </GovBRButton>

        <GovBRButton
          variant="contained"
          startIcon={<DashboardIcon />}
          component={Link}
          href="/publico"
        >
          Ver Dashboard Público
        </GovBRButton>
      </Box>
    </Container>
  )
}
