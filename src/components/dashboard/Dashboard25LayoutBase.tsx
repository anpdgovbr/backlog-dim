"use client"

import type { SelectChangeEvent, Theme } from "@mui/material"
import {
  Alert,
  AlertTitle,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material"
import Grid from "@mui/material/Grid"
import React, { useEffect, useState } from "react"

import { Menu25Base } from "../menu/Menu25Base"

/**
 * Exige ao menos 1 item no array, impedindo arrays vazios em tempo de compilação.
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Interface de cada seção (sem lazy).
 */
export interface ILayoutSection {
  /** Identificador único da seção. */
  readonly id: string
  /** Título exibido no menu ou no Select. Em CAIXA ALTA quando renderizado. */
  readonly title: string
  /** Descrição exibida na segunda linha (quando expandido). */
  readonly description?: string
  /** Ícone exibido junto ao título na linha superior. */
  readonly icon?: React.ReactNode
  /** Cor base usada para ícone, etc. */
  readonly baseColor: string
  /** Componente React que será renderizado no “conteúdo principal”. */
  readonly component: React.ComponentType<unknown>

  /**
   * Conteúdo extra que aparece abaixo do `description` quando o menu está expandido.
   * Se não precisar, pode omitir.
   */
  readonly extraContent?: React.ReactNode

  /**
   * Cor de fundo quando o item está “fechado” (collapsed).
   * Se não for fornecido, usa "#eaf3fc".
   */
  readonly collapsedBgColor?: string

  /**
   * Cor de fundo quando o item está “aberto” (expanded).
   * Se não for fornecido, usa "#ffffff".
   */
  readonly expandedBgColor?: string
}

/**
 * Interface das props do layout base.
 */
export interface IDashboard25LayoutBaseProps {
  /**
   * Lista de seções (não vazia).
   */
  readonly sections: NonEmptyArray<ILayoutSection>

  /**
   * Qual seção deve aparecer inicialmente.
   */
  readonly defaultSectionId: string

  /**
   * Caso a seção não seja encontrada, exibiremos esse fallback.
   */
  readonly fallback?: React.ReactNode
}

/**
 * `Dashboard25LayoutBase` é um layout que exibe:
 * - Menu lateral em telas grandes (`md=4`),
 * - `<Select>` em telas pequenas,
 * - Conteúdo principal (`md=8`) conforme a seção selecionada.
 */
export default function Dashboard25LayoutBase(props: IDashboard25LayoutBaseProps) {
  const { sections, defaultSectionId, fallback } = props

  // Verifica se a tela está acima do breakpoint "md"
  const isUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))

  // Armazena a seção selecionada
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

  /**
   * Renderiza o conteúdo principal da seção selecionada.
   */
  function renderSelectedSection() {
    const foundSection = sections.find((sec) => sec.id === selectedSection)
    if (!foundSection) {
      return (
        <Box>
          {fallback ?? (
            <Alert sx={{ mx: 1 }} variant="filled" severity="error">
              {" "}
              <AlertTitle> Erro de seção</AlertTitle> Nenhuma seção inicial ou padrão
              encontrada para o seu perfil
            </Alert>
          )}
        </Box>
      )
    }

    const SectionComponent = foundSection.component
    return <SectionComponent />
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container spacing={0} /* espaçamento de 2 entre o menu e o conteúdo */>
        {/* Menu lateral (ou Select) */}
        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          {isUpMd ? (
            <>
              {sections.map((section) => {
                // Consideramos “aberto” se for a seção selecionada
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
              })}
            </>
          ) : (
            // Em telas pequenas, exibimos um Select
            <FormControl fullWidth variant="outlined" sx={{ mx: 1, mb: 1 }} size="small">
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
        </Grid>

        <Grid
          sx={{ p: 0, m: 0 }}
          size={{
            xs: 12,
            md: 9,
          }}
        >
          {renderSelectedSection()}
        </Grid>
      </Grid>
    </Box>
  )
}
