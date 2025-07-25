"use client"

import { useEffect, useState } from "react"

import Business from "@mui/icons-material/Business"
import EngineeringOutlined from "@mui/icons-material/EngineeringOutlined"
import Forum from "@mui/icons-material/Forum"
import Input from "@mui/icons-material/Input"
import PermContactCalendar from "@mui/icons-material/PermContactCalendar"
import Person from "@mui/icons-material/Person"
import Send from "@mui/icons-material/Send"
import UploadFile from "@mui/icons-material/UploadFile"
import Visibility from "@mui/icons-material/Visibility"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import ImportarProcessos from "@/app/dashboard/importar/page"
import ContatoPrevioPage from "@/app/dashboard/metadados/contato-previo/page"
import EncaminhamentoPage from "@/app/dashboard/metadados/encaminhamento/page"
import EvidenciaPage from "@/app/dashboard/metadados/evidencia/page"
import FormaEntradaPage from "@/app/dashboard/metadados/forma-entrada/page"
import PedidoManifestacaoPage from "@/app/dashboard/metadados/pedido-manifestacao/page"
import ListarProcessos from "@/app/dashboard/processos/page"
import GerenciarRequeridos from "@/app/dashboard/requeridos/page"
import ResponsaveisPage from "@/app/dashboard/responsaveis/page"
import type { ISectionConfig } from "@/components/dashboard/Dashboard25Wrapper"
import Dashboard25Wrapper from "@/components/dashboard/Dashboard25Wrapper"
import usePermissoes from "@/hooks/usePermissoes"

const allSections: ISectionConfig[] = [
  {
    id: "processos",
    title: "Processos",
    description: "Gerencie os processos",
    icon: <EngineeringOutlined />,
    baseColor: "#1976d2",
    component: () => <ListarProcessos />,
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
    requiredPermissions: ["Alterar_Usuario"],
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
]

export default function DashboardAdmin() {
  const { permissoes, loading } = usePermissoes()
  const [sections, setSections] = useState<ISectionConfig[]>([])

  useEffect(() => {
    if (!loading) {
      const filteredSections = allSections.filter((section) =>
        section.requiredPermissions?.some((perm) => permissoes[perm])
      )

      // Só atualiza o state se mudou
      setSections((prev) => {
        const prevIds = prev
          .map((s) => s.id)
          .sort()
          .join(",")
        const nextIds = filteredSections
          .map((s) => s.id)
          .sort()
          .join(",")
        return prevIds !== nextIds ? filteredSections : prev
      })
    }
  }, [permissoes, loading])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
