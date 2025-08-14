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

interface SidebarLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  sections: SidebarSection[]
  selectedSectionId: string
  onSectionChange: (sectionId: string) => void
}

export default function SidebarLayout({
  children,
  title,
  subtitle,
  sections,
  selectedSectionId,
  onSectionChange,
}: SidebarLayoutProps) {
  const isUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))
  const [selectedSection, setSelectedSection] = useState<string>(selectedSectionId)

  useEffect(() => {
    setSelectedSection(selectedSectionId)
  }, [selectedSectionId])

  function handleSectionChange(newSectionId: string) {
    setSelectedSection(newSectionId)
    onSectionChange(newSectionId)
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
      {children}
    </DashboardLayout>
  )
}
