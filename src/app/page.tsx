"use client"

import Link from "next/link"

import {
  Homepage,
  type HomepageFeature,
  type HomepageHighlightCardProps,
  type HomepageMetric,
  type HomepageProps,
} from "@anpdgovbr/shared-ui"
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"
import DashboardIcon from "@mui/icons-material/Dashboard"
import InfoIcon from "@mui/icons-material/Info"
import InsightsIcon from "@mui/icons-material/Insights"
import LoginIcon from "@mui/icons-material/Login"
import PublicIcon from "@mui/icons-material/Public"
import SecurityIcon from "@mui/icons-material/Security"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"

const features: HomepageFeature[] = [
  {
    icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Gestão completa",
    description:
      "Cadastre, acompanhe e priorize processos administrativos com visibilidade ponta a ponta.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Acesso seguro",
    description:
      "Autenticação institucional via Keycloak e perfilagem por RBAC garantem controle fino de permissões.",
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Transparência",
    description:
      "Dashboards públicos expõem indicadores oficiais e fortalecem a prestação de contas da DIM.",
  },
  {
    icon: <PublicIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Experiência GovBR",
    description:
      "Interface alinhada ao design system GovBR para acessibilidade e consistência em serviços públicos.",
  },
]

const metrics: HomepageMetric[] = [
  { label: "Processos ativos", value: "280+", helperText: "Fluxos em acompanhamento" },
  { label: "Controladores cadastrados", value: "120" },
  { label: "Indicadores públicos", value: "36", helperText: "Atualizados diariamente" },
]

const highlights: HomepageHighlightCardProps[] = [
  {
    title: "Acesso restrito a servidores da ANPD",
    description:
      "Use suas credenciais institucionais para entrar. Perfis são concedidos conforme atuação e necessidade.",
    actions: [
      {
        label: "Política de acesso",
        variant: "outlined",
        startIcon: <InfoIcon />,
        component: Link,
        href: "/sobre#seguranca",
      },
    ],
  },
]

export default function HomePage() {
  const homepageProps: HomepageProps = {
    hero: {
      highlight: "Backlog DIM",
      title: "Gestão de Processos Administrativos da Divisão de Monitoramento",
      description:
        "Centralize o acompanhamento de denúncias, fiscalizações e fluxos críticos da LGPD em uma única plataforma, com métricas atualizadas e visão 360° dos controladores.",
      actions: [
        {
          label: "Acessar sistema",
          startIcon: <LoginIcon />,
          component: Link,
          href: "/auth/login",
        },
        {
          label: "Dashboard público",
          variant: "outlined",
          startIcon: <DashboardIcon />,
          component: Link,
          href: "/publico",
        },
      ],
    },
    metrics: {
      title: "Indicadores em tempo real",
      subtitle: "Panorama rápido das operações monitoradas pela DIM",
      metrics,
      dense: true,
    },
    features: {
      title: "Por que usar o Backlog DIM",
      subtitle: "Capacidades principais construídas com foco em processos regulatórios",
      features,
      columns: { md: 2, lg: 2 },
    },
    highlights,
    footer: {
      title: "Suporte e documentação",
      description:
        "Acesse a página /sobre para conhecer integrações, requisitos técnicos e processos de suporte ao time.",
      actions: [
        {
          label: "Ver documentação",
          variant: "outlined",
          startIcon: <InsightsIcon />,
          component: Link,
          href: "/sobre",
        },
      ],
    },
    containerProps: { maxWidth: "lg" },
  }

  return <Homepage {...homepageProps} />
}
