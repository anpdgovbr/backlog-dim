"use client"

import ContatoPrevioPage from "@/app/contato-previo/page"
import ImportarProcessos from "@/app/dashboard/processos/importar/page"
import EncaminhamentoPage from "@/app/encaminhamento/page"
import EvidenciaPage from "@/app/evidencia/page"
import FormaEntradaPage from "@/app/forma-entrada/page"
import PedidoManifestacaoPage from "@/app/pedido-manifestacao/page"
import GerenciarProcessos from "@/app/processo/page"
import GerenciarRequeridos from "@/app/requeridos/page"
import ResponsaveisPage from "@/app/responsaveis/page"
import SituacaoPage from "@/app/situacao/page"
import Dashboard25Wrapper, {
  ISectionConfig,
} from "@/components/dashboard/Dashboard25Wrapper"
import usePermissoes from "@/hooks/usePermissoes"
import {
  AssignmentTurnedIn,
  Business,
  EngineeringOutlined,
  Forum,
  Input,
  PermContactCalendar,
  Person,
  Send,
  UploadFile,
  Visibility,
} from "@mui/icons-material"
import { Box, CircularProgress, Container, Typography } from "@mui/material"
import { useEffect, useState } from "react"

const allSections: ISectionConfig[] = [
  {
    id: "processos",
    title: "Processos",
    description: "Gerencie os processos",
    icon: <EngineeringOutlined />,
    baseColor: "#1976d2",
    component: () => <GerenciarProcessos />,
    requiredPermissions: ["Exibir_Processo"],
  },
  {
    id: "importar",
    title: "Importar",
    description: "Importe dados de processos",
    icon: <UploadFile />,
    baseColor: "#ff9800",
    component: () => <ImportarProcessos />,
    requiredPermissions: ["Cadastrar_Processo"],
  },
  {
    id: "paineladmin",
    title: "Painel Admin",
    description: "Gerencie o painel administrativo",
    icon: <Business />,
    baseColor: "#673ab7",
    component: () => {
      return (
        <Container maxWidth="lg" sx={{ minWidth: 600 }}>
          <Typography variant="body1">Painel Admin</Typography>
        </Container>
      )
    },
    requiredPermissions: ["Gerenciar_Relatorios"],
  },
  {
    id: "requeridos",
    title: "Requeridos",
    description: "Gerencie os requeridos",
    icon: <Business />,
    baseColor: "#673ab7",
    component: () => <GerenciarRequeridos />,
    requiredPermissions: ["Exibir_Responsavel"],
  },
  {
    id: "contato_previo",
    title: "Contato Prévio",
    description: "Gerencie os tipos de contato prévio",
    icon: <PermContactCalendar />,
    baseColor: "#4caf50",
    component: () => <ContatoPrevioPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "encaminhamento",
    title: "Encaminhamentos",
    description: "Gerencie os encaminhamentos disponíveis",
    icon: <Send />,
    baseColor: "#f44336",
    component: () => <EncaminhamentoPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "evidencia",
    title: "Evidências",
    description: "Gerencie as evidências registradas",
    icon: <Visibility />,
    baseColor: "#03a9f4",
    component: () => <EvidenciaPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "forma_entrada",
    title: "Formas de Entrada",
    description: "Gerencie as formas de entrada de processos",
    icon: <Input />,
    baseColor: "#ff5722",
    component: () => <FormaEntradaPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "pedido_manifestacao",
    title: "Pedidos de Manifestação",
    description: "Gerencie os pedidos de manifestação",
    icon: <Forum />,
    baseColor: "#9c27b0",
    component: () => <PedidoManifestacaoPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "responsaveis",
    title: "Responsáveis",
    description: "Gerencie os responsáveis pelo atendimento",
    icon: <Person />,
    baseColor: "#009688",
    component: () => <ResponsaveisPage />,
    requiredPermissions: ["Exibir_Responsavel"],
  },
  {
    id: "situacao",
    title: "Situação",
    description: "Gerencie as situações de processos",
    icon: <AssignmentTurnedIn />,
    baseColor: "#3feb3b",
    component: () => <SituacaoPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
]

export default function DashboardAdmin() {
  const { permissoes, loading } = usePermissoes()
  const [sections, setSections] = useState<ISectionConfig[]>([])

  useEffect(() => {
    if (!loading) {
      const filteredSections = allSections.filter((section) =>
        section.requiredPermissions?.some((perm) => permissoes[perm])
      )

      setSections(filteredSections.length > 0 ? filteredSections : [])
    }
  }, [permissoes, loading])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Dashboard25Wrapper
        sectionsConfig={sections as [ISectionConfig, ...ISectionConfig[]]}
        defaultSectionId="processos"
      />
    </Box>
  )
}
