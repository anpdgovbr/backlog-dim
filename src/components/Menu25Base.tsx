'use client'

import { calcIconCircleBg, parseThemeColor } from '@/utils/colorUtils'
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import React from 'react'

interface IMenu25BaseProps {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly icon?: React.ReactNode

  /**
   * Pode ser algo como "primary.light", "secondary.main", "#1978cf" etc.
   * Usada para:
   *  - Borda do card
   *  - Título
   *  - Fundo semitransparente do ícone
   */
  readonly baseColor: string

  /** Define se o item está aberto (expandido) ou fechado. */
  readonly expanded: boolean

  /** Fundo padrão quando fechado/aberto. */
  readonly collapsedBgColor?: string
  readonly expandedBgColor?: string

  /** Aparece apenas quando `expanded` é true. */
  readonly extraContent?: React.ReactNode

  /** Chamado ao clicar no card inteiro. */
  readonly onToggle: () => void
}

export function Menu25Base(props: IMenu25BaseProps) {
  const {
    id,
    title,
    description,
    icon,
    baseColor,
    expanded,
    collapsedBgColor = '#eaf3fc',
    expandedBgColor = '#ffffff',
    extraContent,
    onToggle
  } = props

  return (
    <Box
      id={`menu-item-${id}`}
      onClick={onToggle} // 🔥 Ação agora é ao clicar no card inteiro
      sx={(theme: Theme) => {
        const actualBaseColor = parseThemeColor(theme, baseColor)
        const bgColor = expanded
          ? parseThemeColor(theme, expandedBgColor)
          : parseThemeColor(theme, collapsedBgColor)
        const iconCircleBg = calcIconCircleBg(theme, baseColor)

        return {
          mb: 1,
          p: 1,
          borderRadius: 1,
          bgcolor: bgColor,
          border: `1px solid ${iconCircleBg}`,
          cursor: 'pointer', // 🔥 Indica que o card é clicável
          transition: 'background 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          },

          // 🔹 Linha principal do card
          '& .menu-header': {
            display: 'flex',
            alignItems: 'center', // 🔥 Centraliza verticalmente os elementos
            justifyContent: 'space-between',
            gap: 1, // 🔹 Adiciona espaço uniforme entre os elementos
            flexWrap: 'wrap', // 🔹 Permite que o título quebre linha se necessário
            minHeight: 48 // 🔥 Garante altura mínima uniforme da linha
          },

          '& .iconCircle': {
            minWidth: 40, // 🔥 Garante tamanho mínimo para evitar que quebre
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: iconCircleBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          },

          '& .titleText': {
            textTransform: 'uppercase',
            color: actualBaseColor,
            fontWeight: 700,
            letterSpacing: '0.02em',
            wordBreak: 'break-word', // 🔥 Permite quebra de palavra longa
            flex: 1, // 🔹 Faz o título ocupar o espaço disponível sem quebrar layout
            minWidth: 0, // 🔹 Impede que o título force o card a ficar muito largo
            lineHeight: 1.2
          },

          '& .iconExpand': {
            flexShrink: 0, // 🔹 Garante que o ícone de expansão não quebre linha
            display: 'flex', // 🔹 Para garantir que ele fique alinhado verticalmente
            alignItems: 'center'
          },

          '& .description': {
            mt: 1,
            color: theme.palette.text.secondary
          },

          '& .extraContent': {
            mt: 1
          }
        }
      }}
    >
      {/* 🔹 Linha principal do card */}
      <Box className="menu-header">
        {/* Ícone */}
        {icon && <Box className="iconCircle">{icon}</Box>}

        {/* Título ajustado para suportar palavras grandes */}
        <Typography className="titleText" variant="subtitle1">
          {title}
        </Typography>

        {/* Ícone de expansão/recolhimento - agora fixo à direita */}
        <Box className="iconExpand">
          {expanded ? <KeyboardArrowRight /> : <KeyboardArrowDown />}
        </Box>
      </Box>

      {/* Descrição */}
      {description && (
        <Typography variant="body2" className="description">
          {description}
        </Typography>
      )}

      {/* Conteúdo extra só aparece se estiver expandido */}
      {expanded && extraContent && (
        <Box className="extraContent">{extraContent}</Box>
      )}
    </Box>
  )
}
