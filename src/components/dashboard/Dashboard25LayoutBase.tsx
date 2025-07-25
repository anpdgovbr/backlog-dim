"use client"

import React, { useEffect, useState } from "react"

import type { SelectChangeEvent, Theme } from "@mui/material"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import useMediaQuery from "@mui/material/useMediaQuery"

import { Menu25Base } from "../menu/Menu25Base"

export type NonEmptyArray<T> = [T, ...T[]]

export interface ILayoutSection {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly icon?: React.ReactNode
  readonly baseColor: string
  readonly component: React.ComponentType<unknown>
  readonly extraContent?: React.ReactNode
  readonly collapsedBgColor?: string
  readonly expandedBgColor?: string
}

export interface IDashboard25LayoutBaseProps {
  readonly sections: NonEmptyArray<ILayoutSection>
  readonly defaultSectionId: string
  readonly fallback?: React.ReactNode
}

export default function Dashboard25LayoutBase(props: IDashboard25LayoutBaseProps) {
  const { sections, defaultSectionId, fallback } = props
  const isUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))
  const [selectedSection, setSelectedSection] = useState<string>(defaultSectionId)

  useEffect(() => {
    setSelectedSection(defaultSectionId)
  }, [defaultSectionId])

  function handleSectionChange(newSectionId: string) {
    setSelectedSection(newSectionId)
  }

  function handleSelectChange(event: SelectChangeEvent<string>) {
    handleSectionChange(event.target.value)
  }

  function renderSelectedSection() {
    const foundSection = sections.find((sec) => sec.id === selectedSection)
    if (!foundSection) {
      return (
        <Box>
          {fallback ?? (
            <Alert sx={{ mx: 1 }} variant="filled" severity="error">
              <AlertTitle>Erro de seção</AlertTitle>
              Nenhuma seção inicial ou padrão encontrada para o seu perfil
            </Alert>
          )}
        </Box>
      )
    }

    const SectionComponent = foundSection.component
    return <SectionComponent />
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        height: "100%",
      }}
    >
      {/* Menu lateral */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: "100%", md: 280 },
          bgcolor: "background.paper",
          pr: { xs: 0, md: 2 },
        }}
      >
        {isUpMd ? (
          sections.map((section) => {
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
                collapsedBgColor={section.collapsedBgColor}
                expandedBgColor={section.expandedBgColor}
                extraContent={section.extraContent}
                onToggle={() => handleSectionChange(section.id)}
              />
            )
          })
        ) : (
          <FormControl fullWidth variant="outlined" sx={{ mb: 1 }} size="small">
            <InputLabel>Selecionar Seção</InputLabel>
            <Select
              size="small"
              value={selectedSection}
              onChange={handleSelectChange}
              label="Selecionar Seção"
            >
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.title.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Conteúdo principal */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          overflow: "auto",
          height: "100%",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {renderSelectedSection()}
      </Box>
    </Box>
  )
}
