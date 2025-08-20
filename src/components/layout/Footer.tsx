"use client"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import { useCurrentYear } from "@/hooks/useCurrentYear"

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
        py: { xs: 2, sm: 3 },
      })}
    >
      <Container maxWidth={false}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
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
              mt: 0.5,
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
            }}
          >
            Autoridade Nacional de Proteção de Dados
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
