import { Link, Typography } from "@mui/material"

export default function SystemTitle() {
  return (
    <Typography
      variant="h5" // Um pouco maior para dar mais presença
      component="h1"
      fontWeight={700} // Destacar o nome do sistema
      letterSpacing={0.75} // Pequeno espaçamento para leitura
      sx={{ color: "primary.contrastText", textAlign: "center" }} // Usa a paleta do theme.ts
    >
      <Link
        href="/dashboard"
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Processamento Backlog DIM{" "}
        <Typography
          variant="caption"
          component="sup"
          fontWeight={500}
          sx={{ opacity: 0.8 }}
        >
          Alfa 0.1
        </Typography>
      </Link>
    </Typography>
  )
}
