"use client"

import React from "react"

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { Theme } from "@mui/material/styles"

import { calcIconCircleBg, parseThemeColor } from "@/utils/colorUtils"

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
    collapsedBgColor = "rgba(0, 0, 0, 0.02)", // Mais sutil
    extraContent,
    onToggle,
  } = props

  return (
    <Box
      id={`menu-item-${id}`}
      onClick={onToggle}
      sx={(theme: Theme) => {
        const actualBaseColor = expanded
          ? theme.palette.primary.contrastText
          : parseThemeColor(theme, baseColor)
        const bgColor = expanded
          ? theme.palette.primary.main
          : parseThemeColor(theme, collapsedBgColor)
        const iconCircleBg = expanded
          ? "rgba(255, 255, 255, 0.2)"
          : calcIconCircleBg(theme, baseColor)

        return {
          mb: 0.5,
          p: 0.5,
          borderRadius: 2,
          bgcolor: bgColor,
          border: expanded ? "none" : `1px solid rgba(0, 0, 0, 0.08)`,
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: expanded
            ? "0px 4px 16px rgba(0, 0, 0, 0.12)"
            : "0px 2px 8px rgba(0, 0, 0, 0.06)",
          "&:hover": {
            backgroundColor: expanded
              ? theme.palette.primary.dark
              : "rgba(0, 0, 0, 0.04)",
            transform: "translateY(-1px)",
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
            color: expanded ? theme.palette.primary.contrastText : actualBaseColor,
            fontWeight: theme.typography.fontWeightBold,
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
            color: expanded ? theme.palette.primary.contrastText : actualBaseColor,
            fontSize: 18,
          },

          "& .description": {
            mt: 0.5,
            px: 1,
            fontSize: theme.typography.caption.fontSize,
            color: expanded ? "rgba(255, 255, 255, 0.8)" : theme.palette.text.secondary,
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
