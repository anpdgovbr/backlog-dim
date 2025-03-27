"use client"

import ContatoPrevioPage from "@/app/dashboard/metadados/contato-previo/page"
import EncaminhamentoPage from "@/app/dashboard/metadados/encaminhamento/page"
import EvidenciaPage from "@/app/dashboard/metadados/evidencia/page"
import FormaEntradaPage from "@/app/dashboard/metadados/forma-entrada/page"
import PedidoManifestacaoPage from "@/app/dashboard/metadados/pedido-manifestacao/page"
import SituacaoPage from "@/app/dashboard/metadados/situacao/page"
import Dashboard25Wrapper, {
  ISectionConfig,
} from "@/components/dashboard/Dashboard25Wrapper"
import withPermissao from "@/hoc/withPermissao"
import usePermissoes from "@/hooks/usePermissoes"
import {
  AssignmentTurnedIn,
  Forum,
  Input,
  PermContactCalendar,
  Send,
  Visibility,
} from "@mui/icons-material"
import { Box, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"

import TipoReclamacaoPage from "./tipo-reclamacao/page"

const allSections: ISectionConfig[] = [
  {
    id: "contato_previo",
    title: "Contato Prévio",
    description: "",
    icon: <PermContactCalendar />,
    baseColor: "#4caf50",
    component: () => <ContatoPrevioPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "tipo_reclamacao",
    title: "Tipo de Reclamação",
    description: "",
    icon: <Input />,
    baseColor: "#ff9800",
    component: () => <TipoReclamacaoPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "encaminhamento",
    title: "Encaminhamentos",
    description: "",
    icon: <Send />,
    baseColor: "#f44336",
    component: () => <EncaminhamentoPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "evidencia",
    title: "Evidências",
    description: "",
    icon: <Visibility />,
    baseColor: "#03a9f4",
    component: () => <EvidenciaPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "forma_entrada",
    title: "Formas de Entrada",
    description: "",
    icon: <Input />,
    baseColor: "#ff5722",
    component: () => <FormaEntradaPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
  {
    id: "pedido_manifestacao",
    title: "Pedidos de Manifestação",
    description: "",
    icon: <Forum />,
    baseColor: "#9c27b0",
    component: () => <PedidoManifestacaoPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },

  {
    id: "situacao",
    title: "Situação",
    description: "",
    icon: <AssignmentTurnedIn />,
    baseColor: "#3feb3b",
    component: () => <SituacaoPage />,
    requiredPermissions: ["Exibir_Metadados"],
  },
]

function GerenciarMetadadosContent() {
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
    <Dashboard25Wrapper
      sectionsConfig={sections as [ISectionConfig, ...ISectionConfig[]]}
      defaultSectionId="contato_previo" //@todo: Default section to show, fazer um dashboard inicial
    />
  )
}

const GerenciarMetadados = withPermissao(
  GerenciarMetadadosContent,
  "Exibir",
  "Metadados",
  {
    redirecionar: false,
  }
)

export default GerenciarMetadados
