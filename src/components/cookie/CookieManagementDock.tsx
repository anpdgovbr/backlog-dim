"use client"

import { Box, Typography, Stack } from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"
import { useConsent, useOpenPreferencesModal } from "react-lgpd-consent"
import { GovBRButton } from "@anpdgovbr/shared-ui"

export default function CookieManagementDock() {
  const openModal = useOpenPreferencesModal()
  const { consented, preferences } = useConsent()

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 2,
        minWidth: 200,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        🔧 Cookies
      </Typography>

      <Stack spacing={1}>
        <GovBRButton
          onClick={openModal}
          variant="outlined"
          size="small"
          startIcon={<SettingsIcon />}
          fullWidth
        >
          Configurar Cookies
        </GovBRButton>

        <Typography variant="caption" color="text.secondary">
          Status: {consented ? "✅ Configurado" : "⚠️ Pendente"}
        </Typography>

        {consented && preferences && (
          <Stack spacing={0.5}>
            <Typography variant="caption">Necessários: ✅</Typography>
            <Typography variant="caption">
              Analytics: {preferences.analytics ? "✅" : "❌"}
            </Typography>
            <Typography variant="caption">
              Marketing: {preferences.marketing ? "✅" : "❌"}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
