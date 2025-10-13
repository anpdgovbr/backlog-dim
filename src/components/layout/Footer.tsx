"use client"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import { useCurrentYear } from "@/hooks/useCurrentYear"
import BuildInfo from "@/components/ui/BuildInfo"

export default function Footer() {
  const currentYear = useCurrentYear()

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        mt: "auto",
        width: "100%",
        backgroundColor: theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Container maxWidth={false}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "center",
            py: 1,
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: 500,
            }}
          >
            © {currentYear} Desenvolvido pela DDSS/CGTI
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
              fontFamily: "monospace",
              opacity: 0.8,
            }}
            suppressHydrationWarning
          >
            <BuildInfo />
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
            }}
          >
            Agência Nacional de Proteção de Dados
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
