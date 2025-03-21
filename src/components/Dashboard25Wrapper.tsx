"use client"

import { PermissaoConcedida } from "@/types/Permissao"
import React from "react"

import Dashboard25LayoutBase, {
  ILayoutSection,
  NonEmptyArray,
} from "./Dashboard25LayoutBase"

/**
 * Caso você queira que quem use o wrapper
 * passe o componente em si, sem lazy/dynamic.
 * Ex.: `component: MySectionComponent`
 */
export interface ISectionConfig {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon?: React.ReactNode
  readonly baseColor: string
  readonly component: React.ComponentType<unknown> // <-- Componente estático
  readonly extraContent?: React.ReactNode
  readonly requiredPermissions?: PermissaoConcedida[]
}

/**
 * Props do wrapper: recebe a config de cada seção,
 * a seção padrão e um fallback opcional.
 */
interface IDashboard25WrapperProps {
  readonly sectionsConfig: NonEmptyArray<ISectionConfig>
  readonly defaultSectionId: string
  readonly fallback?: React.ReactNode
}

/**
 * `Dashboard25Wrapper`: converte as `sectionsConfig` em `ILayoutSection`,
 * e repassa para o `Dashboard25LayoutBase`.
 */
export default function Dashboard25Wrapper(props: IDashboard25WrapperProps) {
  const { sectionsConfig, defaultSectionId, fallback } = props

  // Mapeia cada config diretamente (sem lazy)
  const sections: ILayoutSection[] = sectionsConfig.map((config) => ({
    id: config.id,
    title: config.title,
    description: config.description,
    icon: config.icon,
    baseColor: config.baseColor,
    component: config.component,
    extraContent: config.extraContent,
  }))

  return (
    <Dashboard25LayoutBase
      sections={sections as NonEmptyArray<ILayoutSection>}
      defaultSectionId={defaultSectionId}
      fallback={fallback}
    />
  )
}
