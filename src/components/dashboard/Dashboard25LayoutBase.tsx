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
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"

import { parseThemeColor } from "@/utils/colorUtils"
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
        <Box sx={{ p: 1 }}>
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
    return (
      <Box
        sx={(theme) => ({
          // Container com estilo integrado ao Menu25Base
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
          transition: "all 0.3s ease",
          position: "relative",

          // Header da seção com indicador colorido
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            bgcolor:
              parseThemeColor(theme, foundSection.baseColor) ||
              theme.palette.primary.main,
          },

          // Título da seção
          "& .section-title": {
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.5,
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            bgcolor: "rgba(0, 0, 0, 0.02)",

            "& .title-text": {
              textTransform: "uppercase",
              fontWeight: theme.typography.fontWeightBold,
              fontSize: theme.typography.body2.fontSize,
              letterSpacing: "0.02em",
              color:
                parseThemeColor(theme, foundSection.baseColor) ||
                theme.palette.primary.main,
            },

            "& .title-icon": {
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor:
                parseThemeColor(theme, foundSection.baseColor) ||
                theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
            },
          },

          // Container do conteúdo
          "& .section-content": {
            p: 2,
          },

          // Hover effect similar ao Menu25Base
          "&:hover": {
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-1px)",
          },
        })}
      >
        {/* Header da seção */}
        <Box className="section-title">
          {foundSection.icon && <Box className="title-icon">{foundSection.icon}</Box>}
          <Typography className="title-text" variant="body2">
            {foundSection.title}
          </Typography>
          {foundSection.description && (
            <Typography variant="caption" sx={{ color: "text.secondary", ml: "auto" }}>
              {foundSection.description}
            </Typography>
          )}
        </Box>

        {/* Conteúdo da seção */}
        <Box className="section-content">
          <SectionComponent />
        </Box>
      </Box>
    )
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
          pr: { xs: 0, md: 1.5 },
          // Adiciona separação visual sutil
          borderRight: {
            xs: "none",
            md: "1px solid rgba(0, 0, 0, 0.06)",
          },
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
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          p: { xs: 1, md: 2 }, // Padding consistente
          // Background sutil para diferenciar da sidebar
          bgcolor: "rgba(0, 0, 0, 0.01)",
        }}
      >
        {renderSelectedSection()}
      </Box>
    </Box>
  )
}
