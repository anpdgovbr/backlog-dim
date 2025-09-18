"use client"

import Box from "@mui/material/Box"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import Alert from "@mui/material/Alert"
import Backdrop from "@mui/material/Backdrop"
import { alpha } from "@mui/material/styles"
import type { CustomCookieBannerProps } from "react-lgpd-consent"

export default function SimpleCookieBanner({
  acceptAll,
  rejectAll,
  openPreferences,
  texts,
}: Readonly<CustomCookieBannerProps>) {
  return (
    <>
      {/* Backdrop escuro bloqueante */}
      <Backdrop
        open={true}
        sx={{
          backgroundColor: alpha("#000", 0.8),
          zIndex: (theme) => theme.zIndex.modal,
        }}
      />

      {/* Banner bloqueante */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
          zIndex: (theme) => theme.zIndex.modal + 1,
          p: 3,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Stack spacing={2}>
            {/* Título */}
            <Typography variant="h6" component="h2">
              🍪 Este site utiliza cookies
            </Typography>

            {/* Alert com mensagem da lib */}
            <Alert
              severity="info"
              sx={{
                bgcolor: "transparent",
                p: 0,
                "& .MuiAlert-message": { width: "100%" },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {texts.bannerMessage}{" "}
                <strong>
                  Ao aceitar, você terá acesso a todas as funcionalidades do site. Se
                  clicar em "Rejeitar Cookies", os cookies que não forem estritamente
                  necessários serão desativados.
                </strong>{" "}
                Para escolher quais quer autorizar, clique em "Gerenciar cookies". Saiba
                mais em nossa{" "}
                <Link href="/termos-de-uso" target="_blank" rel="noopener">
                  Declaração de Cookies
                </Link>
                .
              </Typography>
            </Alert>

            {/* Botões */}
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              justifyContent="flex-end"
            >
              <GovBRButton
                variant="outlined"
                size="small"
                onClick={openPreferences}
                sx={{ whiteSpace: "nowrap" }}
              >
                {texts.preferences || "Gerenciar cookies"}
              </GovBRButton>

              <GovBRButton
                variant="outlined"
                size="small"
                onClick={rejectAll}
                color="error"
                sx={{ whiteSpace: "nowrap" }}
              >
                {texts.declineAll}
              </GovBRButton>

              <GovBRButton
                variant="contained"
                size="small"
                onClick={acceptAll}
                color="primary"
                sx={{ whiteSpace: "nowrap" }}
              >
                {texts.acceptAll}
              </GovBRButton>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </>
  )
}
