'use client'

import { Box } from '@mui/material'
import Dashboard25Wrapper, {
  ISectionConfig
} from '@/components/Dashboard25Wrapper'
import {
  Group,
  Person,
  List,
  Work,
  Assignment,
  Folder,
  Category,
  Business,
  EngineeringOutlined
} from '@mui/icons-material'
import ImportarProcessos from '@/app/processos/importar/page'

const sectionsConfig: [ISectionConfig, ...ISectionConfig[]] = [
  {
    id: 'importar',
    title: 'Importar',
    description: 'Importe dados de processos',
    icon: <Person />,
    baseColor: '#1976d2',
    component: () => <ImportarProcessos />
  },
  {
    id: 'processos',
    title: 'Processos',
    description: 'Gerencie os processos',
    icon: <EngineeringOutlined />,
    baseColor: '#1976d2',
    component: () => <div>Processos - Conteúdo aqui</div>
  },

  {
    id: 'responsaveis',
    title: 'Responsáveis',
    description: 'Gerencie os responsáveis pelo atendimento',
    icon: <Person />,
    baseColor: '#1976d2',
    component: () => <div>Responsáveis - Conteúdo aqui</div>
  },
  {
    id: 'contato_previo',
    title: 'Contato Prévio',
    description: 'Gerencie os tipos de contato prévio',
    icon: <Group />,
    baseColor: '#ff9800',
    component: () => <div>Contato Prévio - Conteúdo aqui</div>
  },
  {
    id: 'encaminhamento',
    title: 'Encaminhamentos',
    description: 'Gerencie os encaminhamentos disponíveis',
    icon: <Assignment />,
    baseColor: '#4caf50',
    component: () => <div>Encaminhamentos - Conteúdo aqui</div>
  },
  {
    id: 'evidencia',
    title: 'Evidências',
    description: 'Gerencie as evidências registradas',
    icon: <Folder />,
    baseColor: '#f44336',
    component: () => <div>Evidências - Conteúdo aqui</div>
  },
  {
    id: 'forma_entrada',
    title: 'Formas de Entrada',
    description: 'Gerencie as formas de entrada de processos',
    icon: <Category />,
    baseColor: '#9c27b0',
    component: () => <div>Formas de Entrada - Conteúdo aqui</div>
  },
  {
    id: 'pedido_manifestacao',
    title: 'Pedidos de Manifestação',
    description: 'Gerencie os pedidos de manifestação',
    icon: <List />,
    baseColor: '#00bcd4',
    component: () => <div>Pedidos de Manifestação - Conteúdo aqui</div>
  },
  {
    id: 'requeridos',
    title: 'Requeridos',
    description: 'Gerencie os requeridos',
    icon: <Business />,
    baseColor: '#3f51b5',
    component: () => <div>Requeridos - Conteúdo aqui</div>
  },
  {
    id: 'situacao',
    title: 'Situação',
    description: 'Gerencie as situações de processos',
    icon: <Work />,
    baseColor: '#8bc34a',
    component: () => <div>Situação - Conteúdo aqui</div>
  }
]

export default function DashboardAdmin() {
  return (
    <Box>
      <Dashboard25Wrapper
        sectionsConfig={sectionsConfig}
        defaultSectionId="responsaveis"
      />
    </Box>
  )
}
