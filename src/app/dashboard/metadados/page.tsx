"use client"

import { useEffect, useState } from "react"

import AssignmentTurnedIn from "@mui/icons-material/AssignmentTurnedIn"
import Forum from "@mui/icons-material/Forum"
import Input from "@mui/icons-material/Input"
import PermContactCalendar from "@mui/icons-material/PermContactCalendar"
import Send from "@mui/icons-material/Send"
import Visibility from "@mui/icons-material/Visibility"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import ContatoPrevioPage from "@/app/dashboard/metadados/contato-previo/page"
import EncaminhamentoPage from "@/app/dashboard/metadados/encaminhamento/page"
import EvidenciaPage from "@/app/dashboard/metadados/evidencia/page"
import FormaEntradaPage from "@/app/dashboard/metadados/forma-entrada/page"
import PedidoManifestacaoPage from "@/app/dashboard/metadados/pedido-manifestacao/page"
import SituacaoPage from "@/app/dashboard/metadados/situacao/page"
import { SidebarLayout } from "@/components/layouts"
import type { SidebarSection, NonEmptyArray } from "@/components/layouts"
import usePermissoes from "@/hooks/usePermissoes"
import { pode } from "@anpdgovbr/rbac-core"

import TipoReclamacaoPage from "./tipo-reclamacao/page"

const allSections: SidebarSection[] = [
  {
    id: "contato_previo",
    title: "Contato Prévio",
    description: "Gerenciar tipos de contato prévio",
    icon: <PermContactCalendar />,
    baseColor: "#4caf50",
    component: () => <ContatoPrevioPage />,
  },
  {
    id: "tipo_reclamacao",
    title: "Tipo de Reclamação",
    description: "Categorias de reclamações",
    icon: <Input />,
    baseColor: "#ff9800",
    component: () => <TipoReclamacaoPage />,
  },
  {
    id: "encaminhamento",
    title: "Encaminhamentos",
    description: "Tipos de encaminhamento",
    icon: <Send />,
    baseColor: "#f44336",
    component: () => <EncaminhamentoPage />,
  },
  {
    id: "evidencia",
    title: "Evidências",
    description: "Tipos de evidências",
    icon: <Visibility />,
    baseColor: "#03a9f4",
    component: () => <EvidenciaPage />,
  },
  {
    id: "forma_entrada",
    title: "Formas de Entrada",
    description: "Canais de entrada dos processos",
    icon: <Input />,
    baseColor: "#ff5722",
    component: () => <FormaEntradaPage />,
  },
  {
    id: "pedido_manifestacao",
    title: "Pedidos de Manifestação",
    description: "Tipos de manifestação",
    icon: <Forum />,
    baseColor: "#9c27b0",
    component: () => <PedidoManifestacaoPage />,
  },
  {
    id: "situacao",
    title: "Situação",
    description: "Status dos processos",
    icon: <AssignmentTurnedIn />,
    baseColor: "#2e7d32",
    component: () => <SituacaoPage />,
  },
]

export default function GerenciarMetadados() {
  const { permissoes, loading } = usePermissoes()
  const [sections, setSections] = useState<SidebarSection[]>([])

  useEffect(() => {
    if (!loading && pode(permissoes, "Exibir", "Metadados")) {
      setSections(allSections)
    }
  }, [loading, permissoes])

  if (loading) {
    return (
      <SidebarLayout
        title="Gerenciar Metadados"
        subtitle="Carregando configurações..."
        sections={[allSections[0]] as NonEmptyArray<SidebarSection>}
        defaultSectionId="contato_previo"
      />
    )
  }

  if (!pode(permissoes, "Exibir", "Metadados")) {
    return (
      <SidebarLayout
        title="Gerenciar Metadados"
        subtitle="Acesso Restrito"
        sections={[allSections[0]] as NonEmptyArray<SidebarSection>}
        defaultSectionId="contato_previo"
        fallback={
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="error" gutterBottom>
              Acesso Negado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Você não possui permissões para visualizar os metadados do sistema.
            </Typography>
          </Box>
        }
      />
    )
  }

  if (sections.length === 0) {
    return (
      <SidebarLayout
        title="Gerenciar Metadados"
        subtitle="Nenhuma seção disponível"
        sections={[allSections[0]] as NonEmptyArray<SidebarSection>}
        defaultSectionId="contato_previo"
        fallback={
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Nenhuma seção de metadados está disponível para o seu perfil.
            </Typography>
          </Box>
        }
      />
    )
  }

  return (
    <SidebarLayout
      title="Gerenciar Metadados"
      subtitle="Configure categorias e tipos auxiliares do sistema"
      sections={sections as NonEmptyArray<SidebarSection>}
      defaultSectionId="contato_previo"
    />
  )
}
