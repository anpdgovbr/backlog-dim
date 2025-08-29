"use client"

import { useEffect, useState } from "react"

import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import type { Theme } from "@mui/material/styles"
import type { SelectChangeEvent } from "@mui/material/Select"
import useMediaQuery from "@mui/material/useMediaQuery"

import { DashboardLayout } from "@/components/layouts"
import { Menu25Base } from "@/components/menu/Menu25Base"

export interface SidebarSection {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly icon?: React.ReactNode
  readonly baseColor: string
  readonly component: React.ComponentType<unknown>
  readonly extraContent?: React.ReactNode
}

export type NonEmptyArray<T> = [T, ...T[]]

export type SidebarLayoutProps = Readonly<{
  children?: React.ReactNode
  title: string
  subtitle?: string
  sections: SidebarSection[]
  // tornar selecionamento externo opcional
  selectedSectionId?: string
  // novo: id default caso não seja informado selectedSectionId
  defaultSectionId?: string
  // tornar callback opcional
  onSectionChange?: (sectionId: string) => void
  // novo: conteúdo de fallback para a área principal
  fallback?: React.ReactNode
}>

export default function SidebarLayout({
  children,
  title,
  subtitle,
  sections,
  selectedSectionId,
  defaultSectionId,
  onSectionChange,
  fallback,
}: SidebarLayoutProps) {
  const isUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))
  const [selectedSection, setSelectedSection] = useState<string>(
    // inicializar com selectedSectionId -> defaultSectionId -> primeira seção disponível
    selectedSectionId ?? defaultSectionId ?? sections[0]?.id ?? ""
  )

  useEffect(() => {
    // sincronizar quando props mudarem (selectedSectionId, defaultSectionId ou sections)
    setSelectedSection(selectedSectionId ?? defaultSectionId ?? sections[0]?.id ?? "")
  }, [selectedSectionId, defaultSectionId, sections])

  function handleSectionChange(newSectionId: string) {
    setSelectedSection(newSectionId)
    // chamar callback somente se fornecido
    if (onSectionChange) onSectionChange(newSectionId)
  }

  function handleSelectChange(event: SelectChangeEvent<string>) {
    handleSectionChange(event.target.value)
  }

  const sidebarContent = isUpMd ? (
    <Box>
      {sections.map((section) => {
        const expanded = section.id === selectedSection
        return (
          <Menu25Base
            key={section.id}
            id={section.id}
            title={section.title}
            description={section.description}
            baseColor={section.baseColor}
            icon={section.icon}
            expanded={expanded}
            extraContent={section.extraContent}
            onToggle={() => handleSectionChange(section.id)}
          />
        )
      })}
    </Box>
  ) : (
    <Box sx={{ p: 2 }}>
      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel>Selecionar Seção</InputLabel>
        <Select
          value={selectedSection}
          onChange={handleSelectChange}
          label="Selecionar Seção"
        >
          {sections.map((section) => (
            <MenuItem key={section.id} value={section.id}>
              {section.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )

  return (
    <DashboardLayout
      title={title}
      subtitle={subtitle}
      hasSidebar={true}
      sidebar={sidebarContent}
    >
      {/* Usa children se presente, caso contrário tenta renderizar a seção selecionada, se houver; senão usa fallback (ou null) */}
      {children ??
        (() => {
          const selected = sections.find((s) => s.id === selectedSection)
          const SelectedComponent = selected?.component
          return SelectedComponent ? <SelectedComponent /> : (fallback ?? null)
        })()}
    </DashboardLayout>
  )
}
