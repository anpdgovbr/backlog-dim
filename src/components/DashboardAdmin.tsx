"use client"

import ContatoPrevioPage from "@/app/dashboard/admin/contato-previo/page"
import EncaminhamentoPage from "@/app/dashboard/admin/encaminhamento/page"
import EvidenciaPage from "@/app/dashboard/admin/evidencia/page"
import FormaEntradaPage from "@/app/dashboard/admin/forma-entrada/page"
import PedidoManifestacaoPage from "@/app/dashboard/admin/pedido-manifestacao/page"
import GerenciarProcessos from "@/app/dashboard/admin/processo/page"
import GerenciarRequeridos from "@/app/dashboard/admin/requeridos/page"
import ResponsaveisPage from "@/app/dashboard/admin/responsaveis/page"
import SituacaoPage from "@/app/dashboard/admin/situacao/page"
import ImportarProcessos from "@/app/dashboard/processos/importar/page"
import Dashboard25Wrapper, { ISectionConfig } from "@/components/Dashboard25Wrapper"
import {
  // Pedidos de Manifestação
  AssignmentTurnedIn, // Situação
  // Importação de processos
  Business,
  EngineeringOutlined,
  // Formas de Entrada
  Forum,
  // Evidências
  Input,
  // Responsáveis
  PermContactCalendar,
  // Requeridos (empresas)
  Person,
  // Contato Prévio
  Send,
  // Processos
  UploadFile,
  // Encaminhamentos
  Visibility
} from "@mui/icons-material"
import { Box } from "@mui/material"

const sectionsConfig: [ISectionConfig, ...ISectionConfig[]] = [
  {
    id: "processos",
    title: "Processos",
    description: "Gerencie os processos",
    icon: <EngineeringOutlined />,
    baseColor: "#1976d2", // Azul forte
    component: () => <GerenciarProcessos />
  },
  {
    id: "importar",
    title: "Importar",
    description: "Importe dados de processos",
    icon: <UploadFile />,
    baseColor: "#ff9800", // Laranja
    component: () => <ImportarProcessos />
  },
  {
    id: "requeridos",
    title: "Requeridos",
    description: "Gerencie os requeridos",
    icon: <Business />,
    baseColor: "#673ab7", // Roxo escuro
    component: () => <GerenciarRequeridos />
  },
  {
    id: "contato_previo",
    title: "Contato Prévio",
    description: "Gerencie os tipos de contato prévio",
    icon: <PermContactCalendar />,
    baseColor: "#4caf50", // Verde
    component: () => <ContatoPrevioPage />
  },
  {
    id: "encaminhamento",
    title: "Encaminhamentos",
    description: "Gerencie os encaminhamentos disponíveis",
    icon: <Send />,
    baseColor: "#f44336", // Vermelho
    component: () => <EncaminhamentoPage />
  },
  {
    id: "evidencia",
    title: "Evidências",
    description: "Gerencie as evidências registradas",
    icon: <Visibility />,
    baseColor: "#03a9f4", // Azul claro
    component: () => <EvidenciaPage />
  },
  {
    id: "forma_entrada",
    title: "Formas de Entrada",
    description: "Gerencie as formas de entrada de processos",
    icon: <Input />,
    baseColor: "#ff5722", // Laranja queimado
    component: () => <FormaEntradaPage />
  },
  {
    id: "pedido_manifestacao",
    title: "Pedidos de Manifestação",
    description: "Gerencie os pedidos de manifestação",
    icon: <Forum />,
    baseColor: "#9c27b0", // Roxo
    component: () => <PedidoManifestacaoPage />
  },
  {
    id: "responsaveis",
    title: "Responsáveis",
    description: "Gerencie os responsáveis pelo atendimento",
    icon: <Person />,
    baseColor: "#009688", // Verde água
    component: () => <ResponsaveisPage />
  },
  {
    id: "situacao",
    title: "Situação",
    description: "Gerencie as situações de processos",
    icon: <AssignmentTurnedIn />,
    baseColor: "#ffeb3b", // Amarelo
    component: () => <SituacaoPage />
  }
]

export default function DashboardAdmin() {
  return (
    <Box>
      <Dashboard25Wrapper sectionsConfig={sectionsConfig} defaultSectionId="processos" />
    </Box>
  )
}
