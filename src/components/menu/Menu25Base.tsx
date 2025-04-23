"use client"

import { calcIconCircleBg, parseThemeColor } from "@/utils/colorUtils"
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import type { Theme } from "@mui/material/styles"
import React from "react"

interface IMenu25BaseProps {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly icon?: React.ReactNode
  readonly baseColor: string
  readonly expanded: boolean
  readonly collapsedBgColor?: string
  readonly expandedBgColor?: string
  readonly extraContent?: React.ReactNode
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
    collapsedBgColor = "#f2f5f8", // govbr: --gray-2
    expandedBgColor = "#ffffff", // govbr: --pure-0
    extraContent,
    onToggle,
  } = props

  return (
    <Box
      id={`menu-item-${id}`}
      onClick={onToggle}
      sx={(theme: Theme) => {
        const actualBaseColor = parseThemeColor(theme, baseColor)
        const bgColor = expanded
          ? parseThemeColor(theme, expandedBgColor)
          : parseThemeColor(theme, collapsedBgColor)
        const iconCircleBg = calcIconCircleBg(theme, baseColor)

        return {
          mb: 0.5,
          p: 0.5,
          borderRadius: 1,
          bgcolor: bgColor,
          border: `1px solid ${iconCircleBg}`,
          cursor: "pointer",
          transition: "background 0.3s ease",
          boxShadow: expanded ? theme.shadows[1] : "none",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },

          "& .menu-header": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: theme.spacing(1),
            flexWrap: "wrap",
            minHeight: 44,
            padding: theme.spacing(0.5, 1),
          },

          "& .iconCircle": {
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: iconCircleBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 16,
            flexShrink: 0,
          },

          "& .titleText": {
            textTransform: "uppercase",
            color: actualBaseColor,
            fontWeight: theme.typography.fontWeightMedium,
            letterSpacing: "0.02em",
            wordBreak: "break-word",
            flex: 1,
            minWidth: 0,
            lineHeight: 1.3,
            fontSize: theme.typography.body2.fontSize,
          },

          "& .iconExpand": {
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            color: actualBaseColor,
            fontSize: 18,
          },

          "& .description": {
            mt: 0.5,
            px: 1,
            fontSize: theme.typography.caption.fontSize,
            color: theme.palette.text.secondary,
          },

          "& .extraContent": {
            mt: 1,
            px: 1,
          },
        }
      }}
    >
      <Box className="menu-header">
        {icon && <Box className="iconCircle">{icon}</Box>}

        <Typography className="titleText" variant="body2">
          {title}
        </Typography>

        <Box className="iconExpand">
          {expanded ? (
            <KeyboardArrowRight fontSize="small" />
          ) : (
            <KeyboardArrowDown fontSize="small" />
          )}
        </Box>
      </Box>

      {description && (
        <Typography variant="caption" className="description">
          {description}
        </Typography>
      )}

      {expanded && extraContent && <Box className="extraContent">{extraContent}</Box>}
    </Box>
  )
}
